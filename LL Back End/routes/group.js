// routes/group.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/group/my?userId=<uuid>
router.get("/my", async (req, res) => {
  const userId = req.query.userId || req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ error: "Missing user ID" });

  try {
    // find the membership row for this user
    const membership = await prisma.groupMember.findFirst({
      where: { userId },
      include: { group: true },
    });

    if (!membership || !membership.group) {
      return res.json({ group: null, members: [] });
    }

    // pull back everyone in that same group, including their User record
    const members = await prisma.groupMember.findMany({
      where: { groupId: membership.groupId },
      include: { user: true },
    });

    // return the group itself plus a list of { userId, name, status }
    res.json({
      group: membership.group,
      members: members.map((m) => ({
        id:      m.id,
        userId: m.userId,
        name: m.user.full_name,
        status: m.status,
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
    const existing = await prisma.groupMember.findFirst({
      where: { userId },
    });
    if (existing) {
      return res.status(400).json({ error: "You already belong to a group" });
    }

    const group = await prisma.group.create({
      data: {
        ownerId: userId,
        members: {
          create: {
            userId,
            status: "joined",
            joinedAt: new Date(),
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

export default router;
