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

export default function PublicHome() {
  const { openAuthModal } = useUI();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);

  const [listings, allAreas, allMarketplaces] = useFilteredListings(filters);

  useEffect(() => {
    if (!filters && allMarketplaces && allMarketplaces.length > 0 && listings.length > 0) {
      setFilters(getDefaultFilters(listings));
    }
  }, [filters, allMarketplaces, listings]);

  const handleSave = () => openAuthModal();

  // Filter listings to those in current map bounds
  const visibleListings = mapBounds
    ? listings.filter((l) => isListingInBounds(l, mapBounds))
    : listings;

  if (!filters) return null;
  return (
    <div className="pt-10">
      <FilterPanel
        listings={listings}
        filters={filters}
        setFilters={setFilters}
        allAreas={allAreas}
        allMarketplaces={allMarketplaces}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[50px]" style={{ height: "calc(100vh - 128px)" }}>
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          <div className="lg:w-1/2 h-full overflow-y-auto pr-2">
            <ListingGrid
              listings={visibleListings}
              savedIds={[]}
              onSave={handleSave}
            />
          </div>
          <div className="lg:w-1/2 h-full min-h-[400px]">
            <MapView
              listings={listings}
              activeListing={null}
              setActiveListing={() => {}}
              onListingClick={(l) => window.open(`/listing/${l.id}`, "_blank")}
              onBoundsChange={setMapBounds} // <-- new
            />
          </div>
        </div>
      </div>
    </div>
  );
}
