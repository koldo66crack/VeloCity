// routes/group.js
import express from "express";
import { prisma } from "../db.js";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
// const prisma = new PrismaClient();

// Supabase Admin client to fetch user metadata & seed profiles table
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/group/my?userId=<your-uuid>
router.get("/my", async (req, res) => {
  const userId = req.query.userId || req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ error: "Missing user ID" });

  try {
    const membership = await prisma.groupMember.findFirst({
      where: { userId },
      include: { group: true },
    });
    if (!membership) return res.json({ group: null, members: [] });

    const members = await prisma.groupMember.findMany({
      where: { groupId: membership.group.id },
    });

    return res.json({
      group: {
        id:        membership.group.id,
        groupCode: membership.group.groupCode,
        ownerId:   membership.group.ownerId,
        createdAt: membership.group.createdAt,
      },
      members: members.map(m => ({
        id:       m.id,
        userId:   m.userId,
        joinedAt: m.joinedAt,
      })),
    });
  } catch (err) {
    console.error("❌ Failed to fetch group info:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/group/create
router.post("/create", async (req, res) => {
  const userId = req.body.userId || req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ error: "Missing user ID" });

  try {
    if (await prisma.groupMember.findFirst({ where: { userId } })) {
      return res.status(400).json({ error: "You already belong to a group." });
    }

    // fetch auth metadata
    const { data, error: authErr } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (authErr) throw authErr;
    const user = data.user;
    if (!user) return res.status(404).json({ error: "User not found in auth.users" });

    const email    = user.email;
    const fullName = user.user_metadata?.full_name ?? "Anonymous";

    // ensure profile exists
    await prisma.profile.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email, fullName },
    });

    // create group + membership
    const group = await prisma.group.create({
      data: {
        ownerId: userId,
        members: { create: { userId } },
      },
    });
    return res.json({ group });
  } catch (err) {
    console.error("❌ Failed to create group:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/group/joinByCode
router.post("/joinByCode", async (req, res) => {
  const { userId, groupCode } = req.body;
  if (!userId || !groupCode) {
    return res.status(400).json({ error: "Missing userId or groupCode." });
  }

  try {
    if (await prisma.groupMember.findFirst({ where: { userId } })) {
      return res.status(400).json({ error: "You already belong to a group." });
    }

    const group = await prisma.group.findUnique({ where: { groupCode } });
    if (!group) return res.status(404).json({ error: "Invalid group code." });

    const membership = await prisma.groupMember.create({
      data: { groupId: group.id, userId },
    });

    return res.json({
      message: "Successfully joined the group!",
      membership: {
        id:       membership.id,
        groupId:  membership.groupId,
        userId:   membership.userId,
        joinedAt: membership.joinedAt,
      },
    });
  } catch (err) {
    console.error("❌ Failed to join group by code:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// GET /api/group/saved/:groupId
// → list all listings this group has saved
router.get("/saved/:groupId", async (req, res) => {
  const { groupId } = req.params;
  if (!groupId) {
    return res.status(400).json({ error: "Missing groupId" });
  }

  try {
    const saved = await prisma.groupSavedListing.findMany({
      where: { groupId },
    });
    res.json(saved);
  } catch (err) {
    console.error(`❌ GET /api/group/saved/${groupId} error:`, err);
    res.status(500).json({ error: err.message || "Failed to fetch group saves" });
  }
});

// POST /api/group/saved
// → upsert to avoid duplicates
router.post("/saved", async (req, res) => {
  let { userId, groupId, listingId } = req.body;
  if (!userId || !groupId || !listingId) {
    return res
      .status(400)
      .json({ error: "Missing userId, groupId, or listingId" });
  }
  listingId = String(listingId);

  try {
    // upsert requires a unique constraint; if you haven’t yet, add:
    // @@unique([groupId, listingId])
    // to your Prisma model for GroupSavedListing
    const saved = await prisma.groupSavedListing.upsert({
      where: {
        groupId_listingId: { groupId, listingId },
      },
      update: {},               // do nothing if already exists
      create: { groupId, listingId, savedBy: userId },
    });

    // created or already existed
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ POST /api/group/saved error:", err);
    res.status(500).json({ error: err.message || "Failed to save listing" });
  }
});

// DELETE /api/group/saved/:groupId/:listingId
// → remove that listing from the group dashboard
// DELETE /api/group/saved/:groupId/:listingId
router.delete("/saved/:groupId/:listingId", async (req, res) => {
  const { groupId, listingId } = req.params;
  if (!groupId || !listingId) {
    return res.status(400).json({ error: "Missing groupId or listingId" });
  }

  try {
    // Delete the saved listing
    await prisma.groupSavedListing.delete({
      where: { groupId_listingId: { groupId, listingId } },
    });

    // ALSO delete all votes for this listing in this group!
    await prisma.listingVote.deleteMany({
      where: { groupId, listingId },
    });

    res.json({ message: "Group listing unsaved and all votes wiped" });
  } catch (err) {
    console.error(
      `❌ DELETE /api/group/saved/${groupId}/${listingId} error:`,
      err
    );
    res.status(500).json({ error: err.message || "Failed to unsave listing" });
  }
});


// --- VOTING ROUTES ---

/**
 * POST /api/group/vote
 * Upsert a user's vote (+1 or -1) for a listing in a group.
 * Body: { groupId, listingId, userId, vote }
 */
router.post("/vote", async (req, res) => {
  const { groupId, listingId, userId, vote } = req.body;
  if (!groupId || !listingId || !userId || typeof vote !== "number") {
    return res.status(400).json({ error: "Missing groupId, listingId, userId, or vote" });
  }
  if (![1, -1].includes(vote)) {
    return res.status(400).json({ error: "Vote must be +1 or -1" });
  }
  try {
    const savedVote = await prisma.listingVote.upsert({
      where: {
        groupId_listingId_userId: { groupId, listingId, userId }
      },
      update: { vote, createdAt: new Date() },
      create: { groupId, listingId, userId, vote }
    });
    res.status(201).json(savedVote);
  } catch (err) {
    console.error("❌ POST /api/group/vote error:", err);
    res.status(500).json({ error: err.message || "Failed to submit vote" });
  }
});

/**
 * GET /api/group/votes/:groupId/:listingId
 * Get all votes (and voters) for a listing in a group.
 */
router.get("/votes/:groupId/:listingId", async (req, res) => {
  const { groupId, listingId } = req.params;
  if (!groupId || !listingId) {
    return res.status(400).json({ error: "Missing groupId or listingId" });
  }
  try {
    const votes = await prisma.listingVote.findMany({
      where: { groupId, listingId },
      include: {
        user: {
          select: { id: true, fullName: true }
        }
      }
    });
    res.json(votes);
  } catch (err) {
    console.error("❌ GET /api/group/votes/:groupId/:listingId error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch votes" });
  }
});

/**
 * GET /api/group/votes/:groupId
 * Get all votes for all listings in a group (useful for aggregate UI).
 */
router.get("/votes/:groupId", async (req, res) => {
  const { groupId } = req.params;
  if (!groupId) {
    return res.status(400).json({ error: "Missing groupId" });
  }
  try {
    const votes = await prisma.listingVote.findMany({
      where: { groupId },
      include: {
        user: {
          select: { id: true, fullName: true }
        }
      }
    });
    res.json(votes);
  } catch (err) {
    console.error("❌ GET /api/group/votes/:groupId error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch group votes" });
  }
});

export default router;
