// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// --- import your routers ---
import preferencesRoutes from "./routes/preferences.js";
import savedRoutes from "./routes/saved.js";
import viewedRoutes from "./routes/viewed.js";
import groupRoutes from "./routes/group.js";
import smartFiltersRoutes from "./routes/smartFilters.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// --- CORS middleware ---
app.use(
  cors({
    origin: [
      "http://localhost:5173", // your Vite dev server
      "https://lion-lease-frontend.onrender.com",
      "https://velocitygems.com", // new
      "https://www.velocitygems.com", // your live frontend
    ],
    credentials: true, // allow cookies, auth headers, etc.
  })
);

// --- JSON body parsing ---
app.use(express.json());

// --- Mount all your feature routers ---
app.use("/api/preferences", preferencesRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/viewed", viewedRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/smart-filters", smartFiltersRoutes);

// --- Health check ---
app.get("/", (req, res) => {
  res.send("🦁 Lion Lease backend is alive and roaring!");
});

// --- Start your server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
