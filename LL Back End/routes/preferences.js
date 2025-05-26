// routes/preferences.js
import express from "express";
import { prisma } from "../db.js";

// const prisma = new PrismaClient();
const router = express.Router();

// parse JSON bodies
router.use(express.json());

/**
 * GET /api/preferences/:userId
 * → fetch this user’s preferences (or empty object)
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  // console.log(`[${new Date().toISOString()}] GET /api/preferences/${userId}`);
  try {
    const prefs = await prisma.userPreferences.findUnique({ where: { userId } });
    res.json(prefs || {});
  } catch (err) {
    console.error(`❌ GET /api/preferences/${userId} error:`, err);
    res.status(500).json({ error: err.message || "Failed to fetch preferences" });
  }
});

/**
 * POST /api/preferences
 * → create or update via upsert
 */
router.post("/", async (req, res) => {
  const {
    userId,
    minBudget,
    maxBudget,
    bedrooms,
    bathrooms,
    maxDistance,
    lionScores,
    maxComplaints,
    onlyNoFee,
    onlyFeatured,
    areas,
  } = req.body;

  // console.log(`[${new Date().toISOString()}] POST /api/preferences →`, req.body);

  // build data object without undefineds
  const data = {
    minBudget,
    maxBudget,
    bedrooms,
    bathrooms,
    maxDistance,
    lionScores,
    maxComplaints,
    onlyNoFee,
    onlyFeatured,
    areas,
  };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

  try {
    const result = await prisma.userPreferences.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
    res.json(result);
  } catch (err) {
    console.error(`❌ POST /api/preferences error:`, err);
    res.status(500).json({ error: err.message || "Failed to save preferences" });
  }
});

/**
 * DELETE /api/preferences/:userId
 */
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  // console.log(`[${new Date().toISOString()}] DELETE /api/preferences/${userId}`);
  try {
    await prisma.userPreferences.delete({ where: { userId } });
    res.json({ message: "Preferences deleted" });
  } catch (err) {
    console.error(`❌ DELETE /api/preferences/${userId} error:`, err);
    res.status(500).json({ error: err.message || "Failed to delete preferences" });
  }
});

export default router;
