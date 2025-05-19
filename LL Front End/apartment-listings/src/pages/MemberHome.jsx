// src/pages/MemberHome.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUI } from "../store/useUI";
import FilterPanel from "../components/FilterPanel";
import ListingGrid from "../components/ListingGrid";
import MapView from "../components/MapViewGoogle";
import {
  useFilteredListings,
  DEFAULT_FILTERS,
} from "../hooks/useFilteredListings";

// Ensure this env var is defined in your deploy settings
const BASE_URL = import.meta.env.VITE_API_URL;

export default function MemberHome() {
  const { uid } = useParams();
  const { openAuthModal } = useUI();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [origFilters, setOrigFilters] = useState(DEFAULT_FILTERS);
  const [prefLoaded, setPrefLoaded] = useState(false);
  const [savedIds, setSavedIds] = useState([]);
  const [viewedIds, setViewedIds] = useState([]);
  const [listings, allAreas] = useFilteredListings(filters);

  // Load user preferences, saved & viewed listings
  useEffect(() => {
    if (!uid) return;
    (async () => {
      // Preferences
      const prefRes = await fetch(`${BASE_URL}/api/preferences/${uid}`);
      if (prefRes.ok) {
        const data = await prefRes.json();
        if (data) {
          const loaded = {
            minPrice: data.minBudget ?? DEFAULT_FILTERS.minPrice,
            maxPrice: data.maxBudget ?? DEFAULT_FILTERS.maxPrice,
            bedrooms:
              data.bedrooms != null
                ? String(data.bedrooms)
                : DEFAULT_FILTERS.bedrooms,
            bathrooms:
              data.bathrooms != null
                ? String(data.bathrooms)
                : DEFAULT_FILTERS.bathrooms,
            lionScores: data.lionScores ?? DEFAULT_FILTERS.lionScores,
            marketplaces: data.marketplaces ?? DEFAULT_FILTERS.marketplaces,
            maxComplaints:
              data.maxComplaints ?? DEFAULT_FILTERS.maxComplaints,
            onlyNoFee: data.onlyNoFee ?? DEFAULT_FILTERS.onlyNoFee,
            onlyFeatured:
              data.onlyFeatured ?? DEFAULT_FILTERS.onlyFeatured,
            areas: data.areas ?? DEFAULT_FILTERS.areas,
          };
          setFilters(loaded);
          setOrigFilters(loaded);
        }
      }
      setPrefLoaded(true);

      // Saved Listings
      const savedRes = await fetch(`${BASE_URL}/api/saved/${uid}`);
      if (savedRes.ok) {
        const rows = await savedRes.json();
        setSavedIds(rows.map((r) => String(r.listingId)));
      }

      // Viewed Listings
      const viewedRes = await fetch(`${BASE_URL}/api/viewed/${uid}`);
      if (viewedRes.ok) {
        const rows = await viewedRes.json();
        setViewedIds(rows.map((r) => String(r.listingId)));
      }
    })();
  }, [uid]);

  // Save preference changes when user updates filters
  useEffect(() => {
    if (!prefLoaded) return;
    if (JSON.stringify(filters) !== JSON.stringify(origFilters)) {
      if (window.confirm("Save new preferences?")) {
        const payload = {
          userId: uid,
          minBudget: filters.minPrice,
          maxBudget: filters.maxPrice,
          bedrooms:
            filters.bedrooms === "any"
              ? null
              : Number(filters.bedrooms),
          bathrooms:
            filters.bathrooms === "any"
              ? null
              : Number(filters.bathrooms),
          lionScores: filters.lionScores,
          marketplaces: filters.marketplaces,
          areas: filters.areas,
          onlyNoFee: filters.onlyNoFee,
          onlyFeatured: filters.onlyFeatured,
          maxComplaints: filters.maxComplaints,
        };
        fetch(`${BASE_URL}/api/preferences`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then(() => setOrigFilters(filters));
      } else {
        setFilters(origFilters);
      }
    }
  }, [filters, origFilters, prefLoaded, uid]);

  // Handlers to save/view listings
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

  return (
    <div className="pt-10">
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        allAreas={allAreas}
      />
      <div className="max-w-7xl mt-6 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex lg:flex-row gap-6 h-[calc(100vh-200px)]">
          <div className="lg:w-1/2 h-full overflow-y-auto pr-2">
            <ListingGrid
              listings={listings}
              savedIds={savedIds}
              viewedIds={viewedIds}
              onSave={handleSave}
              onView={handleView}
            />
          </div>
          <div className="lg:w-1/2 h-full">
            <MapView
              listings={listings}
              activeListing={null}
              setActiveListing={() => {}}
              onListingClick={(l) => {
                handleView(l.id);
                window.open(`/listing/${l.id}`);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}