// routes/viewed.js
import express from "express";
import { prisma } from "../db.js";

// const prisma = new PrismaClient();
const router = express.Router();

// parse JSON bodies
router.use(express.json());

/**
 * POST /api/viewed
 * → upsert viewedAt timestamp
 */
router.post("/", async (req, res) => {
  const { userId, listingId } = req.body;
  if (!userId || !listingId) {
    return res.status(400).json({ error: "Missing userId or listingId" });
  }
  const listingIdStr = String(listingId);

  // console.log(`[${new Date().toISOString()}] POST /api/viewed →`, {
  //   userId,
  //   listingId: listingIdStr,
  // });

  try {
    const viewed = await prisma.viewedListing.upsert({
      where: { userId_listingId: { userId, listingId: listingIdStr } },
      update: { viewedAt: new Date() },
      create: { userId, listingId: listingIdStr },
    });
    res.json(viewed);
  } catch (err) {
    console.error(`❌ POST /api/viewed error:`, err);
    res.status(500).json({ error: err.message || "Failed to mark listing as viewed" });
  }
});

/**
 * GET /api/viewed/:userId
 * → list all viewed listings
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  // console.log(`[${new Date().toISOString()}] GET /api/viewed/${userId}`);
  try {
    const viewed = await prisma.viewedListing.findMany({ where: { userId } });
    res.json(viewed);
  } catch (err) {
    console.error(`❌ GET /api/viewed/${userId} error:`, err);
    res.status(500).json({ error: err.message || "Failed to fetch viewed listings" });
  }
});

export default router;
