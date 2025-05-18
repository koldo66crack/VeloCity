// routes/invites.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const router = express.Router();
router.use(express.json());

const FRONTEND_URL = process.env.APP_URL || "http://localhost:5173";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    await prisma.groupInvite.create({
      data: { groupId, inviterId, invitedEmail, inviteCode },
    });

    const inviteLink = `${FRONTEND_URL}/join?code=${inviteCode}`;

    // send Supabase magic-link email that redirects to our inviteLink
    const { error: supaErr } = await supabase.auth.signInWithOtp({
      email: invitedEmail,
      options: { emailRedirectTo: inviteLink },
    });
    if (supaErr) {
      console.error("[Supabase Magic Link] ", supaErr);
      return res.status(500).json({ error: "Failed to send invite email." });
    }

    res.status(201).json({ message: `Invite sent to ${invitedEmail}!` });
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
  const { userId, userEmail } = req.body;
  if (!userId || !userEmail) {
    return res.status(400).json({ error: "Missing userId or userEmail." });
  }

  try {
    const invite = await prisma.groupInvite.findUnique({ where: { inviteCode } });
    if (!invite) {
      return res.status(400).json({ error: "Invalid invite code." });
    }
    if (invite.accepted) {
      return res.status(400).json({ error: "Invite already accepted." });
    }
    if (invite.invitedEmail !== userEmail) {
      return res.status(403).json({ error: "This invite isn’t for your email address." });
    }

    // Add user to group, record join time
    await prisma.groupMember.create({
      data: {
        groupId: invite.groupId,
        userId,
        status: "joined",
        joinedAt: new Date(),
      },
    });

    // Mark invite as accepted
    await prisma.groupInvite.update({
      where: { inviteCode },
      data: { accepted: true },
    });

    // Return updated member list
    const members = await prisma.groupMember.findMany({
      where: { groupId: invite.groupId },
      include: { user: true },
    });
    res.json({
      groupId: invite.groupId,
      members: members.map((m) => ({
        userId: m.userId,
        name: m.user.full_name,
        status: m.status,
      })),
    });
  } catch (error) {
    console.error("[Accept Invite] Error:", error);
    res.status(500).json({ error: "Server error while accepting invite." });
  }
});

export default router;
