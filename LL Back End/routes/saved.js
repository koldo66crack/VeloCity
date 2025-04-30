// routes/saved.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// parse JSON bodies
router.use(express.json());

/**
 * GET /api/saved/:userId
 * → list all this user’s saved listings
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const saved = await prisma.savedListing.findMany({ where: { userId } });
    res.json(saved);
  } catch (err) {
    console.error(`❌ GET /api/saved/${userId} error:`, err);
    res.status(500).json({ error: err.message || "Failed to fetch saved listings" });
  }
});

/**
 * POST /api/saved
 * → upsert to avoid duplicates
 */
router.post("/", async (req, res) => {
  let { userId, listingId } = req.body;
  if (!userId || !listingId) {
    return res.status(400).json({ error: "Missing userId or listingId" });
  }
  listingId = String(listingId);

  try {
    const saved = await prisma.savedListing.upsert({
      where: { userId_listingId: { userId, listingId } },
      update: {},           // no changes if already exists
      create: { userId, listingId },
    });
    res.status(201).json(saved);
  } catch (err) {
    console.error(`❌ POST /api/saved error:`, err);
    res.status(500).json({ error: err.message || "Failed to save listing" });
  }
});

/**
 * DELETE /api/saved/:userId/:listingId
 */
router.delete("/:userId/:listingId", async (req, res) => {
  const { userId, listingId } = req.params;
  try {
    await prisma.savedListing.delete({
      where: { userId_listingId: { userId, listingId } },
    });
    res.json({ message: "Listing unsaved" });
  } catch (err) {
    console.error(`❌ DELETE /api/saved/${userId}/${listingId} error:`, err);
    res.status(500).json({ error: err.message || "Failed to unsave listing" });
  }
});

export default router;
