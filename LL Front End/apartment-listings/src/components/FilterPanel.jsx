import React, { useState, useEffect, useRef } from "react";
import location from "../assets/svg/location-svgrepo-com.svg";
import dropdown from "../assets/svg/dropdown-svgrepo-com.svg";
import more from "../assets/svg/more-circle-svgrepo-com.svg";
import save from "../assets/svg/bookmark-svgrepo-com.svg";

import LocationFilter from "./LocationFilter";
import PriceFilter from "./PriceFilter";
import BedBathFilter from "./BedBathFilter";
import LionScoreFilter from "./LionScoreFilter";
import MoreFilters from "./MoreFilters";
import MarketplaceFilter from "./MarketplaceFilter";

export default function FilterPanel({ filters, setFilters, allAreas }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const [tempAreas, setTempAreas] = useState(filters.areas);
  const [tempPrice, setTempPrice] = useState({
    min: filters.minPrice ?? "",
    max: filters.maxPrice ?? "",
  });
  const [tempBed, setTempBed] = useState(filters.bedrooms);
  const [tempBath, setTempBath] = useState(filters.bathrooms);
  const [tempLionScores, setTempLionScores] = useState(filters.lionScores);
  const [tempFilters, setTempFilters] = useState({
    maxComplaints: filters.maxComplaints,
    onlyNoFee: filters.onlyNoFee,
    onlyFeatured: filters.onlyFeatured,
  });

  const [tempMarketplaces, setTempMarketplaces] = useState(filters.marketplaces);

  const locationDropdownRef = useRef();
  const filtersDropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown((d) => (d === "location" ? null : d));
      }
      if (
        filtersDropdownRef.current &&
        !filtersDropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown((d) =>
          ["price", "beds", "lion", "more", "marketplace"].includes(d)
            ? null
            : d
        );
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-100 border-b sticky top-[64px] z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* LOCATION */}
          <div className="relative" ref={locationDropdownRef}>
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "location" ? null : "location")
              }
              className="flex items-center gap-2 text-sm text-blue-500 font-semibold hover:underline hover:cursor-pointer"
            >
              <img src={location} alt="location" className="w-4 h-4" />
              LOCATION
            </button>
            {openDropdown === "location" && (
              <LocationFilter
                allAreas={allAreas}
                tempAreas={tempAreas}
                setTempAreas={setTempAreas}
                setFilters={setFilters}
                setOpenDropdown={setOpenDropdown}
              />
            )}
          </div>

          {/* ALL OTHER FILTERS */}
          <div
            className="flex flex-wrap items-center gap-6 text-sm text-blue-500 font-semibold relative"
            ref={filtersDropdownRef}
          >
            {/* PRICE */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "price" ? null : "price")
                }
                className="flex items-center gap-1 hover:underline hover:cursor-pointer"
              >
                PRICE
                <img src={dropdown} alt="dropdown" className="w-3 h-3" />
              </button>
              {openDropdown === "price" && (
                <PriceFilter
                  tempPrice={tempPrice}
                  setTempPrice={setTempPrice}
                  setFilters={setFilters}
                  setOpenDropdown={setOpenDropdown}
                />
              )}
            </div>

            {/* BED / BATH */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "beds" ? null : "beds")
                }
                className="flex items-center gap-1 hover:underline hover:cursor-pointer"
              >
                BEDS / BATHS
                <img src={dropdown} alt="dropdown" className="w-3 h-3" />
              </button>
              {openDropdown === "beds" && (
                <BedBathFilter
                  tempBed={tempBed}
                  tempBath={tempBath}
                  setTempBed={setTempBed}
                  setTempBath={setTempBath}
                  setFilters={setFilters}
                  setOpenDropdown={setOpenDropdown}
                />
              )}
            </div>

            {/* LION SCORE */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "lion" ? null : "lion")
                }
                className="flex items-center gap-1 hover:underline hover:cursor-pointer"
              >
                LION SCORE
                <img src={dropdown} alt="dropdown" className="w-3 h-3" />
              </button>
              {openDropdown === "lion" && (
                <LionScoreFilter
                  tempLionScores={tempLionScores}
                  setTempLionScores={setTempLionScores}
                  setFilters={setFilters}
                  setOpenDropdown={setOpenDropdown}
                />
              )}
            </div>

            {/* MARKETPLACE */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "marketplace" ? null : "marketplace"
                  )
                }
                className="flex items-center gap-1 hover:underline hover:cursor-pointer"
              >
                MARKETPLACE
                <img src={dropdown} alt="dropdown" className="w-3 h-3" />
              </button>
              {openDropdown === "marketplace" && (
                <MarketplaceFilter
                  tempMarketplaces={tempMarketplaces}
                  setTempMarketplaces={setTempMarketplaces}
                  setFilters={setFilters}
                  setOpenDropdown={setOpenDropdown}
                />
              )}
            </div>

            {/* MORE */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "more" ? null : "more")
                }
                className="flex items-center gap-2 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
              >
                <img src={more} alt="more filters" className="w-4 h-4" />
                MORE
              </button>
              {openDropdown === "more" && (
                <MoreFilters
                  tempFilters={tempFilters}
                  setTempFilters={setTempFilters}
                  setFilters={setFilters}
                  setOpenDropdown={setOpenDropdown}
                />
              )}
            </div>
          </div>

          {/* SAVE SEARCH BUTTON */}
          <button className="border border-gray-300 px-4 py-2 rounded font-semibold hover:bg-blue-100 hover:cursor-pointer text-sm flex items-center gap-2">
            <img src={save} alt="save search" className="w-4 h-4" />
            SAVE SEARCH
          </button>
        </div>
      </div>
    </header>
  );
}