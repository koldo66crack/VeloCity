// src/hooks/useFilteredListings.js
import { useState, useEffect, useMemo } from "react";
import enrichedListings from "../data/combined_listings_with_lionscore.json";

// --- UTILITIES ---
function normalizeAreaName(area) {
  // "UPPER WEST SIDE" → "Upper West Side"
  if (!area) return "";
  return area
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

function extractAllMarketplaces(listings) {
  const set = new Set();
  listings.forEach(l => {
    if (Array.isArray(l.marketplace)) {
      l.marketplace.forEach(mp => set.add(mp));
    } else if (typeof l.marketplace === "string") {
      set.add(l.marketplace);
    }
  });
  return Array.from(set).sort();
}

function extractAllAreas(listings) {
  const normSet = new Set();
  listings.forEach(l => {
    const raw = l.orig_area_name || l.area_name;
    if (raw) normSet.add(normalizeAreaName(raw));
  });
  return Array.from(normSet).sort();
}

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
  };
}

function applyFilters(listings, filters) {
  if (!filters) return listings;
  return listings.filter((l) => {
    const price = l.price || l.net_effective_price || 0;
    const beds =
      l.bedrooms ?? (l.rooms_description?.toLowerCase().includes("studio") ? 0.5 : null);
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

    if (
      filters.marketplaces.length > 0 &&
      !(
        Array.isArray(l.marketplace) ? l.marketplace : [l.marketplace]
      ).some((m) => filters.marketplaces.includes(m))
    )
      return false;

    if (complaints > filters.maxComplaints) return false;
    if (filters.onlyNoFee && !l.no_fee) return false;
    if (filters.onlyFeatured && !l.is_featured) return false;

    // --- THIS IS THE KEY MODIFICATION ---
    // Only show if the normalized area is in the filters
    if (
      filters.areas.length > 0 &&
      !filters.areas.includes(normalizeAreaName(l.orig_area_name || l.area_name))
    )
      return false;

    return true;
  });
}

export function useFilteredListings(filters) {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    const enhanced = enrichedListings.map((l, idx) => ({
      ...l,
      id: String(idx),
      rating: Math.floor(Math.random() * 6),
    }));
    setAllListings(enhanced);
    setFilteredListings(enhanced);
  }, []);

  useEffect(() => {
    setFilteredListings(applyFilters(allListings, filters));
  }, [allListings, filters]);

  const allAreas = useMemo(() => extractAllAreas(allListings), [allListings]);
  const allMarketplaces = useMemo(() => extractAllMarketplaces(allListings), [allListings]);

  return [filteredListings, allAreas, allMarketplaces];
}
