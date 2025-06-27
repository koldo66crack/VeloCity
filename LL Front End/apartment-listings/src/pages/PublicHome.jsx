// src/pages/PublicHome.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../store/useUI";
import FilterPanel from "../components/FilterPanel";
import ListingGrid from "../components/ListingGrid";
import MapView from "../components/MapViewGoogle";
import {
  useFilteredListings,
  getDefaultFilters,
} from "../hooks/useFilteredListings";

// Helper: check if listing is in map bounds
function isListingInBounds(listing, bounds) {
  if (!bounds || !listing.addr_lat || !listing.addr_lon) return true;
  const lat = Number(listing.addr_lat);
  const lon = Number(listing.addr_lon);
  return (
    lat <= bounds.north &&
    lat >= bounds.south &&
    lon <= bounds.east &&
    lon >= bounds.west
  );
}

// --- UNIVERSAL QUERY PARAMS (HashRouter + BrowserRouter) ---
function getQueryParams() {
  // Try normal search first
  let search = window.location.search;
  if (!search || search === "?") {
    const hash = window.location.hash || "";
    const queryStart = hash.indexOf("?");
    if (queryStart !== -1) {
      search = hash.slice(queryStart);
    }
  }
  return new URLSearchParams(search);
}

export default function PublicHome() {
  const { openAuthModal } = useUI();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);

  // New: toggle for mobile view
  const [mobileView, setMobileView] = useState("list"); // "list" or "map"

  // Listings + helpers
  const [listings, allAreas, allMarketplaces] = useFilteredListings(filters);

  // Set initial filters based on query params
  useEffect(() => {
    if (
      !filters &&
      allMarketplaces &&
      allMarketplaces.length > 0 &&
      listings.length > 0
    ) {
      const params = getQueryParams();
      const onlyHiddenGems = params.get("onlyHiddenGems");
      let initFilters = getDefaultFilters(listings);

      if (onlyHiddenGems) {
        // Exclude StreetEasy and Zillow
        const HIDDEN_GEM_MARKETS = allMarketplaces.filter(
          (mp) =>
            mp.toLowerCase() !== "streeteasy" &&
            mp.toLowerCase() !== "zillow"
        );
        initFilters = { ...initFilters, marketplaces: HIDDEN_GEM_MARKETS };
      }
      setFilters(initFilters);
    }
    // Add hash to deps so this re-triggers when URL changes for SPA!
  }, [filters, allMarketplaces, listings, window.location.hash]);

  const handleSave = () => openAuthModal();

  // Listings visible in current map bounds
  const visibleListings = mapBounds
    ? listings.filter((l) => isListingInBounds(l, mapBounds))
    : listings;

  if (!filters) return null;

  return (
    <div className="pt-10 bg-gray-900 min-h-screen">
      <FilterPanel
        listings={listings}
        filters={filters}
        setFilters={setFilters}
        allAreas={allAreas}
        allMarketplaces={allMarketplaces}
      />

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[50px]"
        style={{ height: "calc(100vh - 128px)" }}
      >
        {/* Mobile: Toggle buttons */}
        <div className="md:hidden flex justify-between mb-2">
          <button
            className={`flex-1 py-2 font-semibold border-b-2 ${
              mobileView === "list"
                ? "border-[#34495e] text-[#34495e]"
                : "border-transparent text-gray-400"
            }`}
            onClick={() => setMobileView("list")}
          >
            Listings
          </button>
          <button
            className={`flex-1 py-2 font-semibold border-b-2 ${
              mobileView === "map"
                ? "border-[#34495e] text-[#34495e]"
                : "border-transparent text-gray-400"
            }`}
            onClick={() => setMobileView("map")}
          >
            Map
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Listings: only show on desktop or if mobileView==="list" */}
          <div
            className={`lg:w-1/2 h-full overflow-y-auto pr-2 ${
              mobileView === "map" ? "hidden md:block" : ""
            }`}
          >
            <ListingGrid
              listings={visibleListings}
              savedIds={[]}
              onSave={handleSave}
            />
          </div>
          {/* Map: only show on desktop or if mobileView==="map" */}
          <div
            className={`lg:w-1/2 h-full min-h-[400px] ${
              mobileView === "list" ? "hidden md:block" : ""
            }`}
          >
            <MapView
              listings={listings}
              activeListing={null}
              setActiveListing={() => {}}
              onListingClick={(l) => window.open(`/listing/${l.id}`, "_blank")}
              onBoundsChange={setMapBounds}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
