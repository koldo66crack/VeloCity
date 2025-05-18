// routes/invites.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const router = express.Router();

// Parse incoming JSON bodies
router.use(express.json());

/**
 * POST /api/invites
 * Create a new invite for groupId → invitedEmail
 */
router.post("/", async (req, res) => {
  const { groupId, invitedEmail, inviterId } = req.body;

  if (!groupId || !invitedEmail || !inviterId) {
    return res.status(400).json({ error: "Missing groupId, invitedEmail, or inviterId." });
  }

  try {
    const inviteCode = uuidv4();
    const invite = await prisma.groupInvite.create({
      data: { groupId, inviterId, invitedEmail, inviteCode },
    });

    const inviteLink = `${process.env.APP_URL || "http://localhost:5173"}/join?code=${inviteCode}`;

    res.status(201).json({ 
      message: "Invite created successfully!",
      invite,
      inviteLink,
    });
  } catch (error) {
    console.error("[Create Invite] Error:", error);
    res.status(500).json({ error: "Server error while creating invite." });
  }
});

/**
 * GET /api/invites/:inviteCode
 * Look up an invite by code
 */
router.get("/:inviteCode", async (req, res) => {
  const { inviteCode } = req.params;

  try {
    const invite = await prisma.groupInvite.findUnique({
      where: { inviteCode },
      include: { group: true },
    });

    if (!invite) {
      return res.status(404).json({ error: "Invite code not found or invalid." });
    }

    res.json({
      id: invite.id,
      invitedEmail: invite.invitedEmail,
      accepted: invite.accepted,
      group: {
        id: invite.group.id,
        createdAt: invite.group.createdAt,
        ownerId: invite.group.ownerId,
      },
    });
  } catch (error) {
    console.error("[Fetch Invite] Error:", error);
    res.status(500).json({ error: "Server error while fetching invite." });
  }
});

/**
 * POST /api/invites/:inviteCode/accept
 * Accept an invite
 */
router.post("/:inviteCode/accept", async (req, res) => {
  const { inviteCode } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId." });
  }

  try {
    const invite = await prisma.groupInvite.findUnique({ where: { inviteCode } });

    if (!invite) {
      return res.status(400).json({ error: "Invalid invite code." });
    }
    if (invite.accepted) {
      return res.status(400).json({ error: "Invite already accepted." });
    }

    // Add user to group
    await prisma.groupMember.create({
      data: {
        groupId: invite.groupId,
        userId,
        status: "joined",
      },
    });

    // Mark invite as accepted
    await prisma.groupInvite.update({
      where: { inviteCode },
      data: { accepted: true },
    });

    res.json({ message: "Successfully joined the group!" });
  } catch (error) {
    console.error("[Accept Invite] Error:", error);
    res.status(500).json({ error: "Server error while accepting invite." });
  }
});

export default router;