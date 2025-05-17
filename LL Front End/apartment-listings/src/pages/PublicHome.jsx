// src/pages/PublicHome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../store/useUI";
import FilterPanel from "../components/FilterPanel";
import ListingGrid from "../components/ListingGrid";
import MapView from "../components/MapViewGoogle";
import {
  useFilteredListings,
  DEFAULT_FILTERS,
} from "../hooks/useFilteredListings";

export default function PublicHome() {
  const { openAuthModal } = useUI();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [listings, allAreas] = useFilteredListings(filters);

  const handleSave = () => openAuthModal();

  return (
    <div className="pt-10">
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        allAreas={allAreas}
      />

      <div className="max-w-7xl mt-6 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
          <div className="lg:w-1/2 h-full overflow-y-auto pr-2">
            <ListingGrid
              listings={listings}
              savedIds={[]}
              onSave={handleSave}
            />
          </div>
          <div className="lg:w-1/2 h-full">
            <MapView
              listings={listings}
              activeListing={null}
              setActiveListing={() => {}}
              onListingClick={(l) =>
                window.open(`/listing/${l.id}`, "_blank")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}