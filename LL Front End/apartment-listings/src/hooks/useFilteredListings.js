import { useState, useEffect, useMemo } from "react";
import enrichedListings from "../data/combined_listings_with_lionscore.json";
import { calculateWalkingDistance } from "../utils/distanceUtils";

// --- Utilities ---

// Normalizes area names (case-insensitive, trims, etc.)
function normalizeAreaName(area) {
  if (!area) return "";
  return area
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

// Normalizes marketplaces for consistent matching (e.g., "streeteasy" → "StreetEasy")
function normalizeMarketplace(mp) {
  if (!mp) return "";
  // Capitalize each word, remove extra spaces
  return mp
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

// Extract unique marketplaces from listings, normalized and sorted
function extractAllMarketplaces(listings) {
  const set = new Set();
  listings.forEach((l) => {
    if (Array.isArray(l.marketplace)) {
      l.marketplace.forEach((mp) => set.add(normalizeMarketplace(mp)));
    } else if (typeof l.marketplace === "string") {
      set.add(normalizeMarketplace(l.marketplace));
    }
  });
  return Array.from(set).sort();
}

// Extract unique, normalized area names from listings
function extractAllAreas(listings) {
  const normSet = new Set();
  listings.forEach((l) => {
    const raw = l.orig_area_name || l.area_name;
    if (raw) normSet.add(normalizeAreaName(raw));
  });
  return Array.from(normSet).sort();
}

// Sort listings by price or distance (or none, for original shuffle)
const COLUMBIA_COORDS = { lat: 40.816151, lng: -73.943653 };
function sortListings(listings, sortOption) {
  if (!sortOption || sortOption === "original") {
    // No sorting, preserve order
    return listings;
  }
  return [...listings].sort((a, b) => {
    const priceA = a.net_effective_price || a.price || 0;
    const priceB = b.net_effective_price || b.price || 0;
    const distA = calculateWalkingDistance(
      COLUMBIA_COORDS.lat,
      COLUMBIA_COORDS.lng,
      a.addr_lat,
      a.addr_lon
    );
    const distB = calculateWalkingDistance(
      COLUMBIA_COORDS.lat,
      COLUMBIA_COORDS.lng,
      b.addr_lat,
      b.addr_lon
    );

    if (sortOption === "price-asc") return priceA - priceB;
    if (sortOption === "price-desc") return priceB - priceA;
    if (sortOption === "distance-asc") return distA - distB;
    if (sortOption === "distance-desc") return distB - distA;
    return 0;
  });
}

// Fisher-Yates shuffle for the original listing order
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Default Filters (with sortOption) ---
export function getDefaultFilters(listings) {
  return {
    minPrice: null,
    maxPrice: null,
    bedrooms: "any",
    bathrooms: "any",
    lionScores: [
      "✅ Reasonable",
      "🔥 Steal Deal",
      "🚨 Too Cheap to Be True",
      "💸 Overpriced",
    ],
    marketplaces: extractAllMarketplaces(listings),
    maxComplaints: 500,
    onlyNoFee: false,
    onlyFeatured: false,
    areas: [],
    sortOption: "original", // Preserves shuffled order unless changed
  };
}

// --- Apply Filters to Listings ---
function applyFilters(listings, filters) {
  if (!filters) return listings;

  // Normalize selected marketplaces filter just once for efficiency
  const normalizedMarketplaces =
    filters.marketplaces && filters.marketplaces.length
      ? filters.marketplaces.map(normalizeMarketplace)
      : [];

  return listings.filter((l) => {
    const price = l.price || l.net_effective_price || 0;
    const beds =
      l.bedrooms ??
      (l.rooms_description?.toLowerCase().includes("studio") ? 0.5 : null);
    const baths = l.bathrooms ?? 0;
    const complaints =
      Object.values(l.building_complaints || {}).reduce((a, b) => a + b, 0);

    if (filters.minPrice != null && price < filters.minPrice) return false;
    if (filters.maxPrice != null && price > filters.maxPrice) return false;

    if (filters.bedrooms !== "any") {
      const req =
        filters.bedrooms === "4+"
          ? beds >= 4
          : filters.bedrooms === "Studio"
          ? beds === 0.5
          : beds === parseFloat(filters.bedrooms);
      if (!req) return false;
    }

    if (
      filters.bathrooms !== "any" &&
      baths < parseFloat(filters.bathrooms)
    )
      return false;

    if (
      filters.lionScores.length > 0 &&
      !filters.lionScores.includes(l.LionScore)
    )
      return false;

    // ---- MARKETPLACE FILTER, NORMALIZED MATCHING ----
    if (
      normalizedMarketplaces.length > 0 &&
      !(
        Array.isArray(l.marketplace)
          ? l.marketplace.map(normalizeMarketplace)
          : [normalizeMarketplace(l.marketplace)]
      ).some((m) => normalizedMarketplaces.includes(m))
    )
      return false;

    if (complaints > filters.maxComplaints) return false;
    if (filters.onlyNoFee && !l.no_fee) return false;
    if (filters.onlyFeatured && !l.is_featured) return false;

    if (
      filters.areas.length > 0 &&
      !filters.areas.includes(normalizeAreaName(l.orig_area_name || l.area_name))
    )
      return false;

    return true;
  });
}

// --- Main Hook ---
export function useFilteredListings(filters) {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);

  // Shuffle once on mount for "original" order
  useEffect(() => {
    const enhanced = enrichedListings.map((l, idx) => ({
      ...l,
      id: l.id || l.listing_id || l.source_url || l.source_id || String(idx),
      rating: Math.floor(Math.random() * 6),
    }));
    const shuffled = shuffleArray(enhanced);
    setAllListings(shuffled); // SHUFFLE!
    setFilteredListings(shuffled); // for first render
  }, []);

  // Apply filters + sort
  useEffect(() => {
    let filtered = applyFilters(allListings, filters);
    // Only sort if user picks a sort option (or preserve original)
    if (filters && filters.sortOption) {
      filtered = sortListings(filtered, filters.sortOption);
    }
    setFilteredListings(filtered);
  }, [allListings, filters]);

  // Unique areas & marketplaces (used in UI)
  const allAreas = useMemo(() => extractAllAreas(allListings), [allListings]);
  const allMarketplaces = useMemo(
    () => extractAllMarketplaces(allListings),
    [allListings]
  );

  return [filteredListings, allAreas, allMarketplaces];
}
