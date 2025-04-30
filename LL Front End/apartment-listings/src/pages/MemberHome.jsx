import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useUI } from "../store/useUI";

import enrichedListings from "../data/combined_listings_with_lionscore.json";
import FilterPanel from "../components/FilterPanel";
import ListingGrid from "../components/ListingGrid";
import MapView from "../components/MapViewGoogle";

export default function MemberHome() {
  const { uid } = useParams();
  const { openAuthModal } = useUI();

  const initialFilters = {
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
    maxComplaints: 500,
    onlyNoFee: false,
    onlyFeatured: false,
    areas: [],
  };

  const [filters, setFilters] = useState(initialFilters);
  const [origFilters, setOrigFilters] = useState(initialFilters);
  const [prefLoaded, setPrefLoaded] = useState(false);
  const [savedIds, setSavedIds] = useState([]);
  const [viewedIds, setViewedIds] = useState([]);
  const [filteredListings, setFiltered] = useState(enrichedListings);

  // Load preferences, saved, viewed on mount
  useEffect(() => {
    if (!uid) return;
    (async () => {
      // 1. Preferences
      const prefRes = await fetch(`/api/preferences/${uid}`);
      if (prefRes.ok) {
        const data = await prefRes.json();
        if (data) {
          // Map backend prefs to our filter keys
          setFilters({
            minPrice: data.minBudget ?? null,
            maxPrice: data.maxBudget ?? null,
            bedrooms: data.bedrooms != null ? String(data.bedrooms) : "any",
            bathrooms: data.bathrooms != null ? String(data.bathrooms) : "any",
            lionScores: data.lionScores ?? initialFilters.lionScores,
            maxComplaints: data.maxComplaints ?? initialFilters.maxComplaints,
            onlyNoFee: data.onlyNoFee ?? initialFilters.onlyNoFee,
            onlyFeatured: data.onlyFeatured ?? initialFilters.onlyFeatured,
            areas: data.areas ?? initialFilters.areas,
          });
          setOrigFilters({
            minPrice: data.minBudget ?? null,
            maxPrice: data.maxBudget ?? null,
            bedrooms: data.bedrooms != null ? String(data.bedrooms) : "any",
            bathrooms: data.bathrooms != null ? String(data.bathrooms) : "any",
            lionScores: data.lionScores ?? initialFilters.lionScores,
            maxComplaints: data.maxComplaints ?? initialFilters.maxComplaints,
            onlyNoFee: data.onlyNoFee ?? initialFilters.onlyNoFee,
            onlyFeatured: data.onlyFeatured ?? initialFilters.onlyFeatured,
            areas: data.areas ?? initialFilters.areas,
          });
        }
      }
      setPrefLoaded(true);
      // 2. Saved
      const savedRes = await fetch(`/api/saved/${uid}`);
      if (savedRes.ok) {
        const rows = await savedRes.json();
        setSavedIds(rows.map((r) => String(r.listingId)));
      }
      // 3. Viewed
      const viewedRes = await fetch(`/api/viewed/${uid}`);
      if (viewedRes.ok) {
        const rows = await viewedRes.json();
        setViewedIds(rows.map((r) => String(r.listingId)));
      }
    })();
  }, [uid]);

  // Save preferences when filters change and differ from original
  useEffect(() => {
    if (!prefLoaded) return;
    const changed = JSON.stringify(filters) !== JSON.stringify(origFilters);
    if (changed) {
      if (window.confirm("Save new preferences?")) {
        // transform to backend shape
        const payload = {
          userId: uid,
          minBudget: filters.minPrice,
          maxBudget: filters.maxPrice,
          bedrooms:
            filters.bedrooms === "any" ? null : Number(filters.bedrooms),
          maxDistance: filters.maxDistance,
          // you can extend with lionScores, areas, onlyNoFee, etc.
        };
        fetch("/api/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then(() => setOrigFilters(filters));
      } else {
        // revert to original
        setFilters(origFilters);
      }
    }
  }, [filters]);

  // Re-apply filters on change
  useEffect(() => {
    let out = enrichedListings;
    if (filters.minPrice != null)
      out = out.filter(
        (l) => (l.price || l.net_effective_price) >= filters.minPrice
      );
    if (filters.maxPrice != null)
      out = out.filter(
        (l) => (l.price || l.net_effective_price) <= filters.maxPrice
      );
    if (filters.bedrooms !== "any") {
      out = out.filter((l) => {
        const beds =
          l.bedrooms ??
          (l.rooms_description?.toLowerCase().includes("studio") ? 0.5 : null);
        return filters.bedrooms === "4+"
          ? beds >= 4
          : filters.bedrooms === "Studio"
          ? beds === 0.5
          : beds === parseFloat(filters.bedrooms);
      });
    }
    if (filters.bathrooms !== "any")
      out = out.filter((l) => l.bathrooms >= parseFloat(filters.bathrooms));
    if (filters.lionScores.length)
      out = out.filter((l) => filters.lionScores.includes(l.LionScore));
    out = out.filter(
      (l) =>
        Object.values(l.building_complaints || {}).reduce((a, b) => a + b, 0) <=
        filters.maxComplaints
    );
    if (filters.onlyNoFee) out = out.filter((l) => l.no_fee);
    if (filters.onlyFeatured) out = out.filter((l) => l.is_featured);
    if (filters.areas.length)
      out = out.filter((l) => filters.areas.includes(l.area_name));
    setFiltered(out);
  }, [filters]);

  // handleSave & handleView unchanged...
  // Handle save
  const handleSave = (listingId) => {
    if (!uid) {
      openAuthModal();
      return;
    }
    const idStr = String(listingId);
    setSavedIds((prev) => [...new Set([...prev, idStr])]);
    fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: uid, listingId: idStr }),
    });
  };

  // Handle view
  const handleView = (listingId) => {
    if (!uid) return;
    const idStr = String(listingId);
    if (!viewedIds.includes(idStr)) {
      setViewedIds((prev) => [...new Set([...prev, idStr])]);
      fetch("/api/viewed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, listingId: idStr }),
      });
    }
  };

  return (
    <div className="pt-20">
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        allAreas={[...new Set(enrichedListings.map((l) => l.area_name))]}
      />
      <div className="max-w-7xl mt-6 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex lg:flex-row gap-6 h-[calc(100vh-200px)]">
          <div className="lg:w-1/2 h-full overflow-y-auto pr-2">
            <ListingGrid
              listings={filteredListings}
              savedIds={savedIds}
              viewedIds={viewedIds}
              onSave={handleSave}
              onView={handleView}
            />
          </div>
          <div className="lg:w-1/2 h-full">
            <MapView
              listings={filteredListings}
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
