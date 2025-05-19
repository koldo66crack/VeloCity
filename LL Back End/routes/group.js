import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/group/my?userId=<your-uuid>
router.get("/my", async (req, res) => {
  const userId = req.query.userId || req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ error: "Missing user ID" });

  try {
    // 1) Load membership + its Group
    const membership = await prisma.groupMember.findFirst({
      where: { userId },
      include: { group: true },
    });

    // 2) No membership → no group
    if (!membership) {
      return res.json({ group: null, members: [] });
    }

    // 3) Fetch all members of that group
    const members = await prisma.groupMember.findMany({
      where: { groupId: membership.group.id },
    });

    // 4) Return only the fields you have defined
    res.json({
      group: {
        id:        membership.group.id,
        groupCode: membership.group.groupCode,
        ownerId:   membership.group.ownerId,
        createdAt: membership.group.createdAt,
      },
      members: members.map((m) => ({
        id:        m.id,
        userId:    m.userId,
        status:    m.status,
        invitedAt: m.invitedAt,
        joinedAt:  m.joinedAt,
      })),
    });
  } catch (err) {
    console.error("❌ Failed to fetch group info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/group/create
router.post("/create", async (req, res) => {
  const userId = req.body.userId || req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ error: "Missing user ID" });

  try {
    // ensure they’re not already in a group
    const existing = await prisma.groupMember.findFirst({
      where: { userId },
    });
    if (existing) {
      return res.status(400).json({ error: "You already belong to a group." });
    }

    // create the group (Prisma auto-generates `groupCode`) + your membership
    const group = await prisma.group.create({
      data: {
        ownerId: userId,
        members: {
          create: {
            userId,
            status: "joined",
          },
        },
      },
    });

    res.json({ group });
  } catch (err) {
    console.error("❌ Failed to create group:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/group/joinByCode
router.post("/joinByCode", async (req, res) => {
  const { userId, groupCode } = req.body;
  if (!userId || !groupCode) {
    return res.status(400).json({ error: "Missing userId or groupCode." });
  }

  try {
    // ensure they’re not already in a group
    if (await prisma.groupMember.findFirst({ where: { userId } })) {
      return res.status(400).json({ error: "You already belong to a group." });
    }

    // find the group by code
    const group = await prisma.group.findUnique({
      where: { groupCode },
    });
    if (!group) {
      return res.status(404).json({ error: "Invalid group code." });
    }

    // add them as a joined member
    await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId,
        status: "joined",
      },
    });

    res.json({ message: "Successfully joined the group!", groupId: group.id });
  } catch (err) {
    console.error("[JoinByCode Error]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
