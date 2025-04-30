import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../store/useUI";

import listingsData from "../data/combined_listings_with_lionscore.json";
import FilterPanel from "../components/FilterPanel";
import ListingGrid from "../components/ListingGrid";
import MapView from "../components/MapViewGoogle";

export default function PublicHome() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFiltered] = useState([]);
  const [viewMode, setViewMode] = useState("split"); // "grid" or "split"
  const [filters, setFilters] = useState({
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
  });
  const { openAuthModal } = useUI();
  const navigate = useNavigate();

  // 1) Enrich listings on mount
  useEffect(() => {
    const inferArea = (l) => {
      const zip = l.addr_zip;
      const street = (l.addr_street || "").toUpperCase();
      const { addr_lat: lat, addr_lon: lng } = l;
      if (zip === "10025" || street.includes("103RD") || street.includes("104"))
        return "Morningside Heights";
      if (
        zip === "10027" ||
        street.includes("ST NICHOLAS") ||
        street.includes("135")
      )
        return "Harlem";
      if (zip === "10031") return "Hamilton Heights";
      if (zip === "10024" || zip === "10023") return "Upper West Side";
      if (zip === "10026" || zip === "10029") return "Manhattan Valley";
      if (lat && lng) {
        if (lat > 40.805 && lat < 40.82 && lng > -73.96 && lng < -73.94)
          return "Morningside Heights";
        if (lat > 40.812 && lat < 40.827 && lng > -73.95 && lng < -73.93)
          return "Manhattanville";
        if (lat > 40.83 && lng < -73.95) return "Harlem";
      }
      return "Unknown";
    };

    const enhanced = listingsData.map((l, idx) => ({
      ...l,
      id: idx,
      area_name: l.area_name || inferArea(l),
      rating: Math.floor(Math.random() * 6),
    }));
    setListings(enhanced);
  }, []);

  // 2) Filter whenever filters or listings change
  useEffect(() => {
    const out = listings.filter((l) => {
      const price = l.price || l.net_effective_price || 0;
      const beds =
        l.bedrooms ??
        (l.rooms_description?.toLowerCase().includes("studio") ? 0.5 : null);
      const baths = l.bathrooms ?? null;
      const complaints = Object.values(l.building_complaints || {}).reduce(
        (a, b) => a + b,
        0
      );

      if (filters.minPrice !== null && price < filters.minPrice) return false;
      if (filters.maxPrice !== null && price > filters.maxPrice) return false;
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
        parseFloat(baths) < parseFloat(filters.bathrooms)
      )
        return false;
      if (
        filters.lionScores.length > 0 &&
        !filters.lionScores.includes(l.LionScore)
      )
        return false;
      if (complaints > filters.maxComplaints) return false;
      if (filters.onlyNoFee && !l.no_fee) return false;
      if (filters.onlyFeatured && !l.is_featured) return false;
      if (filters.areas.length > 0 && !filters.areas.includes(l.area_name))
        return false;
      return true;
    });
    setFiltered(out);
  }, [filters, listings]);

  const handleSave = (listingId) => {
    openAuthModal();
  };

  return (
    <div className="pt-10">
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        allAreas={Array.from(new Set(listings.map((l) => l.area_name)))}
      />
      <div className="max-w-7xl mt-6 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
          <div className="lg:w-1/2 h-full overflow-y-auto pr-2">
            <ListingGrid
              listings={filteredListings}
              savedIds={[]}
              onSave={handleSave}
            />
          </div>
          <div className="lg:w-1/2 h-full">
            <MapView
              listings={filteredListings}
              activeListing={null}
              setActiveListing={() => {}}
              onListingClick={(l) => window.open(`/listing/${l.id}`, "_blank")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
