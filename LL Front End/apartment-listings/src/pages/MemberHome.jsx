// src/pages/MemberHome.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useUI } from "../store/useUI";
import FilterPanel from "../components/FilterPanel";
import ListingGrid from "../components/ListingGrid";
import ListingCountDisplay from "../components/ListingCountDisplay";
import MapView from "../components/MapViewGoogle";
import {
  useFilteredListings,
  getDefaultFilters,
} from "../hooks/useFilteredListings";
import { usePagination } from "../hooks/usePagination";

// Helper: Checks if a listing's coordinates are inside map bounds
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

const BASE_URL = import.meta.env.VITE_API_URL;

export default function MemberHome() {
  const { uid } = useParams();
  const { openAuthModal } = useUI();

  const [filters, setFilters] = useState(null);
  const [origFilters, setOrigFilters] = useState(null);
  const [prefLoaded, setPrefLoaded] = useState(false);

  const [savedIds, setSavedIds] = useState([]);
  const [viewedIds, setViewedIds] = useState([]);

  const [group, setGroup] = useState(null);
  const [groupSavedIds, setGroupSavedIds] = useState([]);

  const [mapBounds, setMapBounds] = useState(null);

  // *** NEW: Mobile view toggle ***
  const [mobileView, setMobileView] = useState("list"); // "list" or "map"

  // Ref to track if filters have been initialized
  const filtersInitialized = useRef(false);
  // Ref to track if we're loading user preferences
  const loadingPreferences = useRef(false);

  const [listings, allAreas, allMarketplaces] = useFilteredListings(filters);

  // 1. Initialize filters (including ONLY HIDDEN GEMS) **once** on mount
  useEffect(() => {
    if (
      !filtersInitialized.current &&
      allMarketplaces &&
      allMarketplaces.length > 0 &&
      listings.length > 0
    ) {
      console.log("Initializing filters...");
      const params = getQueryParams();
      const onlyHiddenGems = params.get("onlyHiddenGems");
      let initFilters = getDefaultFilters(listings);

      if (onlyHiddenGems) {
        const HIDDEN_GEM_MARKETS = allMarketplaces.filter(
          (mp) =>
            mp.toLowerCase() !== "streeteasy" && mp.toLowerCase() !== "zillow"
        );
        initFilters = { ...initFilters, marketplaces: HIDDEN_GEM_MARKETS };
        console.log("Hidden gems mode enabled");
      }
      setFilters(initFilters);
      setOrigFilters(initFilters);
      filtersInitialized.current = true;
      console.log("Filters initialized successfully");
    }
  }, [allMarketplaces, listings]);

  // Handle URL hash changes for onlyHiddenGems parameter
  useEffect(() => {
    if (!filtersInitialized.current || !filters || !allMarketplaces) return;

    const params = getQueryParams();
    const onlyHiddenGems = params.get("onlyHiddenGems");

    if (onlyHiddenGems) {
      const HIDDEN_GEM_MARKETS = allMarketplaces.filter(
        (mp) =>
          mp.toLowerCase() !== "streeteasy" && mp.toLowerCase() !== "zillow"
      );

      // Only update if marketplaces are different
      if (
        JSON.stringify(filters.marketplaces) !==
        JSON.stringify(HIDDEN_GEM_MARKETS)
      ) {
        console.log("Updating filters for hidden gems mode");
        setFilters((prev) => ({ ...prev, marketplaces: HIDDEN_GEM_MARKETS }));
        setOrigFilters((prev) => ({
          ...prev,
          marketplaces: HIDDEN_GEM_MARKETS,
        }));
      }
    } else {
      // If onlyHiddenGems is not in URL, restore all marketplaces
      const allMarketplacesArray = allMarketplaces;
      if (
        JSON.stringify(filters.marketplaces) !==
        JSON.stringify(allMarketplacesArray)
      ) {
        console.log("Restoring all marketplaces");
        setFilters((prev) => ({ ...prev, marketplaces: allMarketplacesArray }));
        setOrigFilters((prev) => ({
          ...prev,
          marketplaces: allMarketplacesArray,
        }));
      }
    }
  }, [window.location.hash, allMarketplaces]);

  // 2. Load user/group data AFTER filters are set, and **only overwrite with preferences if not hidden gems**
  useEffect(() => {
    if (!uid || !filters || loadingPreferences.current) return;

    loadingPreferences.current = true;
    let isMounted = true;

    (async () => {
      try {
        // Preferences
        const prefRes = await fetch(`${BASE_URL}/api/preferences/${uid}`);
        if (prefRes.ok && isMounted) {
          const data = await prefRes.json();
          if (data) {
            // If current filters are "onlyHiddenGems", preserve marketplaces!
            const params = getQueryParams();
            const onlyHiddenGems = params.get("onlyHiddenGems");
            let loaded = {
              minPrice: data.minBudget ?? filters.minPrice,
              maxPrice: data.maxBudget ?? filters.maxPrice,
              bedrooms:
                data.bedrooms != null
                  ? String(data.bedrooms)
                  : filters.bedrooms,
              bathrooms:
                data.bathrooms != null
                  ? String(data.bathrooms)
                  : filters.bathrooms,
              lionScores: data.lionScores ?? filters.lionScores,
              marketplaces:
                onlyHiddenGems && filters.marketplaces.length
                  ? filters.marketplaces // preserve hidden gems selection!
                  : data.marketplaces ?? filters.marketplaces,
              maxComplaints: data.maxComplaints ?? filters.maxComplaints,
              onlyNoFee: data.onlyNoFee ?? filters.onlyNoFee,
              onlyFeatured: data.onlyFeatured ?? filters.onlyFeatured,
              areas: data.areas ?? filters.areas,
              sortOption: data.sortOption ?? filters.sortOption,
            };
            setFilters(loaded);
            setOrigFilters(loaded);
          }
        }
        if (isMounted) setPrefLoaded(true);

        // Personal saved listings
        const savedRes = await fetch(`${BASE_URL}/api/saved/${uid}`);
        if (savedRes.ok && isMounted) {
          const rows = await savedRes.json();
          setSavedIds(rows.map((r) => String(r.listingId)));
        }

        // Viewed listings
        const viewedRes = await fetch(`${BASE_URL}/api/viewed/${uid}`);
        if (viewedRes.ok && isMounted) {
          const rows = await viewedRes.json();
          setViewedIds(rows.map((r) => String(r.listingId)));
        }

        // Group membership and group-saved
        const grpRes = await fetch(`${BASE_URL}/api/group/my?userId=${uid}`);
        if (grpRes.ok && isMounted) {
          const { group: grp } = await grpRes.json();
          setGroup(grp);
          if (grp) {
            const gsRes = await fetch(`${BASE_URL}/api/group/saved/${grp.id}`);
            if (gsRes.ok && isMounted) {
              const rows = await gsRes.json();
              setGroupSavedIds(rows.map((r) => String(r.listingId)));
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        if (isMounted) setPrefLoaded(true);
      } finally {
        if (isMounted) loadingPreferences.current = false;
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [uid, filters]);

  // ---- Handlers ----
  const handleSave = (listingId) => {
    if (!uid) return openAuthModal();
    const idStr = String(listingId);
    setSavedIds((prev) => [...new Set([...prev, idStr])]);
    fetch(`${BASE_URL}/api/saved`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: uid, listingId: idStr }),
    });
  };

  const handleUnsave = (listingId) => {
    if (!uid) return;
    const idStr = String(listingId);
    setSavedIds((prev) => prev.filter((id) => id !== idStr));
    fetch(`${BASE_URL}/api/saved/${uid}/${idStr}`, {
      method: "DELETE",
    });
  };

  const handleView = (listingId) => {
    if (!uid) return;
    const idStr = String(listingId);
    if (!viewedIds.includes(idStr)) {
      setViewedIds((prev) => [...new Set([...prev, idStr])]);
      fetch(`${BASE_URL}/api/viewed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, listingId: idStr }),
      });
    }
  };

  const handleGroupSave = async (listingId) => {
    if (!uid || !group) return;
    const idStr = String(listingId);
    const res = await fetch(`${BASE_URL}/api/group/saved`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: uid,
        groupId: group.id,
        listingId: idStr,
      }),
    });

    if (!res.ok) {
      console.error("Failed to save to group:", await res.text());
      return;
    }

    setGroupSavedIds((prev) => [...new Set([...prev, idStr])]);
  };

  const combinedSavedIds = group
    ? Array.from(new Set([...savedIds, ...groupSavedIds]))
    : savedIds;

  // Filter by map bounds
  const visibleListings = mapBounds
    ? listings.filter((l) => isListingInBounds(l, mapBounds))
    : listings;

  // Pagination hook
  const paginationData = usePagination(visibleListings, false);

  // Reset pagination when filters or map bounds change
  useEffect(() => {
    paginationData.resetToFirstPage();
  }, [filters, mapBounds]);

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
            className={`lg:w-1/2 h-full flex flex-col ${
              mobileView === "map" ? "hidden md:flex" : ""
            }`}
          >
            {/* Listing Count Display */}
            <ListingCountDisplay
              totalItems={paginationData.totalItems}
              isLoading={paginationData.isPageLoading}
              filters={filters}
            />

            {/* Listings Grid with Pagination */}
            <div className="flex-1 overflow-hidden">
              <ListingGrid
                listings={paginationData.currentPageListings}
                savedIds={combinedSavedIds}
                viewedIds={viewedIds}
                onSave={handleSave}
                onUnsave={handleUnsave}
                onGroupSave={group ? handleGroupSave : undefined}
                onView={handleView}
                paginationData={paginationData}
                isLoading={paginationData.isPageLoading}
              />
            </div>
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
              onListingClick={(l) => {
                handleView(l.id);
                window.open(`/listing/${l.id}`);
              }}
              onBoundsChange={setMapBounds}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
