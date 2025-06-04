import React, { useState, useEffect, useRef } from "react";
import location from "../assets/svg/location-svgrepo-com.svg";
import dropdown from "../assets/svg/dropdown-svgrepo-com.svg";

import LocationFilter from "./LocationFilter";
import SortFilter from "./SortFilter";
import PriceFilter from "./PriceFilter";
import BedBathFilter from "./BedBathFilter";
import LionScoreFilter from "./LionScoreFilter";
import MarketplaceFilter from "./MarketplaceFilter";
import TooltipInfo from "./TooltipInfo";

// Helper: Count active filters
function countActive(filters) {
  let count = 0;
  if (filters.areas && filters.areas.length > 0) count++;
  if (filters.minPrice || filters.maxPrice) count++;
  if (filters.bedrooms || filters.bathrooms) count++;
  if (filters.lionScores && filters.lionScores.length > 0) count++;
  if (filters.marketplaces && filters.marketplaces.length > 0) count++;
  if (filters.sortOption && filters.sortOption !== "original") count++;
  return count;
}

export default function FilterPanel({
  filters,
  setFilters,
  allAreas,
  allMarketplaces,
}) {
  // --- Dropdown logic for desktop ---
  const [openDropdown, setOpenDropdown] = useState(null);

  const [tempAreas, setTempAreas] = useState(filters.areas);
  const [tempPrice, setTempPrice] = useState({
    min: filters.minPrice ?? "",
    max: filters.maxPrice ?? "",
  });
  const [tempBed, setTempBed] = useState(filters.bedrooms);
  const [tempBath, setTempBath] = useState(filters.bathrooms);
  const [tempLionScores, setTempLionScores] = useState(filters.lionScores);
  const [tempMarketplaces, setTempMarketplaces] = useState(
    filters.marketplaces
  );
  const [tempSortOption, setTempSortOption] = useState(
    filters.sortOption ?? "original"
  );
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Refs for closing dropdowns on outside click
  const dropdownRefs = {
    location: useRef(),
    sort: useRef(),
    price: useRef(),
    beds: useRef(),
    lion: useRef(),
    marketplace: useRef(),
  };

  useEffect(() => {
    function handleClickOutside(e) {
      Object.entries(dropdownRefs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setOpenDropdown((d) => (d === key ? null : d));
        }
      });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Mobile Modal: Esc to close, disable scroll when open ---
  useEffect(() => {
    if (!showMobileModal) return;
    function handleKey(e) {
      if (e.key === "Escape") setShowMobileModal(false);
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = showMobileModal ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [showMobileModal]);

  // For mobile: Reset temp states on open, apply on "Done"
  function openMobileModal() {
    setTempAreas(filters.areas);
    setTempPrice({
      min: filters.minPrice ?? "",
      max: filters.maxPrice ?? "",
    });
    setTempBed(filters.bedrooms);
    setTempBath(filters.bathrooms);
    setTempLionScores(filters.lionScores);
    setTempMarketplaces(filters.marketplaces);
    setTempSortOption(filters.sortOption ?? "original");
    setShowMobileModal(true);
  }

  function applyMobileFilters() {
    // Defensive: treat "", "Any", null, undefined as "no filter" (undefined)
    const normBed =
      tempBed === undefined ||
      tempBed === "" ||
      tempBed === "Any" ||
      tempBed === "any"
        ? undefined
        : tempBed === "Studio"
        ? 0
        : tempBed;
    const normBath =
      tempBath === undefined ||
      tempBath === "" ||
      tempBath === "Any" ||
      tempBath === "any"
        ? undefined
        : typeof tempBath === "string" && tempBath.endsWith("+")
        ? Number(tempBath.replace("+", ""))
        : tempBath;
    const normMin =
      tempPrice.min === undefined || tempPrice.min === ""
        ? undefined
        : Number(tempPrice.min);
    const normMax =
      tempPrice.max === undefined || tempPrice.max === ""
        ? undefined
        : Number(tempPrice.max);

    setFilters((prev) => ({
      ...prev,
      areas: tempAreas,
      minPrice: normMin,
      maxPrice: normMax,
      bedrooms: normBed,
      bathrooms: normBath,
      lionScores: tempLionScores,
      marketplaces: tempMarketplaces,
      sortOption: tempSortOption,
    }));
    setShowMobileModal(false);
  }

  const activeCount = countActive(filters);

  return (
    <header className="bg-gray-100 border-b sticky top-[64px] z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* --------- DESKTOP VERSION --------- */}
        <div className="hidden md:flex flex-wrap items-center gap-4">
          {/* LOCATION */}
          <div className="relative" ref={dropdownRefs.location}>
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "location" ? null : "location")
              }
              className="flex items-center gap-2 text-sm text-[#34495e] font-semibold hover:underline"
            >
              <img src={location} alt="location" className="w-4 h-4" />
              NEIGHBORHOOD
            </button>
            {openDropdown === "location" && (
              <LocationFilter
                allAreas={allAreas}
                tempAreas={filters.areas}
                setTempAreas={(v) =>
                  setFilters((prev) => ({ ...prev, areas: v }))
                }
                setFilters={setFilters}
                setOpenDropdown={setOpenDropdown}
              />
            )}
          </div>

          {/* SORT */}
          <div className="relative" ref={dropdownRefs.sort}>
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "sort" ? null : "sort")
              }
              className="flex items-center gap-1 text-sm text-[#34495e] font-semibold hover:underline"
            >
              SORT
              <img src={dropdown} alt="dropdown" className="w-3 h-3" />
            </button>
            {openDropdown === "sort" && (
              <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg">
                <SortFilter
                  value={filters.sortOption || "original"}
                  setValue={() => {}} // No-op, as we apply instantly on desktop
                  setFilters={setFilters}
                  setOpenDropdown={setOpenDropdown}
                />
              </div>
            )}
          </div>

          {/* PRICE */}
          <div className="relative" ref={dropdownRefs.price}>
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "price" ? null : "price")
              }
              className="flex items-center gap-1 text-sm text-[#34495e] font-semibold hover:underline"
            >
              PRICE
              <img src={dropdown} alt="dropdown" className="w-3 h-3" />
            </button>
            {openDropdown === "price" && (
              <PriceFilter
                tempPrice={{
                  min: filters.minPrice ?? "",
                  max: filters.maxPrice ?? "",
                }}
                setTempPrice={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: v.min,
                    maxPrice: v.max,
                  }))
                }
                setFilters={setFilters}
                setOpenDropdown={setOpenDropdown}
              />
            )}
          </div>

          {/* BED / BATH */}
          <div className="relative" ref={dropdownRefs.beds}>
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "beds" ? null : "beds")
              }
              className="flex items-center gap-1 text-sm text-[#34495e] font-semibold hover:underline"
            >
              BEDS / BATHS
              <img src={dropdown} alt="dropdown" className="w-3 h-3" />
            </button>
            {openDropdown === "beds" && (
              <BedBathFilter
                tempBed={filters.bedrooms}
                tempBath={filters.bathrooms}
                setTempBed={(v) =>
                  setFilters((prev) => ({ ...prev, bedrooms: v }))
                }
                setTempBath={(v) =>
                  setFilters((prev) => ({ ...prev, bathrooms: v }))
                }
                setFilters={setFilters}
                setOpenDropdown={setOpenDropdown}
              />
            )}
          </div>

          {/* VELO SCORE */}
          <div className="relative" ref={dropdownRefs.lion}>
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "lion" ? null : "lion")
              }
              className="flex items-center gap-1 text-sm text-[#34495e] font-semibold hover:underline"
            >
              VELO SCORE
              <img src={dropdown} alt="dropdown" className="w-3 h-3" />
              <TooltipInfo
                text={`VeloScore™ tells you if the apartment's price matches its value.`}
              />
            </button>
            {openDropdown === "lion" && (
              <LionScoreFilter
                tempLionScores={filters.lionScores}
                setTempLionScores={(v) =>
                  setFilters((prev) => ({ ...prev, lionScores: v }))
                }
                setFilters={setFilters}
                setOpenDropdown={setOpenDropdown}
              />
            )}
          </div>

          {/* SOURCE */}
          <div className="relative" ref={dropdownRefs.marketplace}>
            <button
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "marketplace" ? null : "marketplace"
                )
              }
              className="flex items-center gap-1 text-sm text-[#34495e] font-semibold hover:underline"
            >
              SOURCE
              <img src={dropdown} alt="dropdown" className="w-3 h-3" />
              <TooltipInfo text="Where this listing is originally posted (e.g., StreetEasy, Compass, RentHop, etc.)." />
            </button>
            {openDropdown === "marketplace" && (
              <MarketplaceFilter
                allMarketplaces={allMarketplaces}
                tempMarketplaces={filters.marketplaces}
                setTempMarketplaces={(v) =>
                  setFilters((prev) => ({ ...prev, marketplaces: v }))
                }
                setFilters={setFilters}
                setOpenDropdown={setOpenDropdown}
              />
            )}
          </div>
        </div>

        {/* --------- MOBILE VERSION --------- */}
        <div className="flex md:hidden items-center">
          <button
            className="w-full flex justify-center items-center bg-white text-[#34495e] font-bold py-2 shadow border border-[#34495e] text-lg relative"
            onClick={openMobileModal}
          >
            <span className="mr-2">Filters</span>
            {activeCount > 0 && (
              <span className="bg-[#34495e] text-white rounded-full px-2 py-0.5 text-xs font-semibold ml-1">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* MOBILE FILTER MODAL */}
        {showMobileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-end md:hidden">
            <div className="w-full max-h-[90vh] bg-white shadow-lg p-6 overflow-y-auto animate-fadein">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold text-[#34495e]">Filters</div>
                <button
                  onClick={() => setShowMobileModal(false)}
                  className="text-gray-400 hover:text-[#34495e] text-2xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {/* Neighborhood */}
                <div>
                  <div className="text-xs text-[#34495e] font-semibold mb-1 flex items-center gap-2">
                    <img src={location} alt="location" className="w-4 h-4" />
                    Neighborhood
                  </div>
                  <LocationFilter
                    allAreas={allAreas}
                    tempAreas={tempAreas}
                    setTempAreas={setTempAreas}
                    mobile={true}
                  />
                </div>

                {/* Sort */}
                <div>
                  <div className="text-xs text-[#34495e] font-semibold mb-1">
                    Sort
                  </div>
                  <SortFilter
                    value={tempSortOption}
                    setValue={setTempSortOption}
                    mobile={true}
                  />
                </div>

                {/* Price */}
                <div>
                  <div className="text-xs text-[#34495e] font-semibold mb-1">
                    Price
                  </div>
                  <PriceFilter
                    tempPrice={tempPrice}
                    setTempPrice={setTempPrice}
                    mobile={true}
                  />
                </div>

                {/* Bed/Bath */}
                <div>
                  <div className="text-xs text-[#34495e] font-semibold mb-1">
                    Beds / Baths
                  </div>
                  <BedBathFilter
                    tempBed={tempBed}
                    tempBath={tempBath}
                    setTempBed={setTempBed}
                    setTempBath={setTempBath}
                    mobile={true}
                  />
                </div>

                {/* VeloScore */}
                <div>
                  <div className="text-xs text-[#34495e] font-semibold mb-1 flex items-center gap-2">
                    VeloScore
                    <TooltipInfo
                      text={`VeloScore™ tells you if the apartment's price matches its value.`}
                    />
                  </div>
                  <LionScoreFilter
                    tempLionScores={tempLionScores}
                    setTempLionScores={setTempLionScores}
                    mobile={true}
                  />
                </div>

                {/* Source */}
                <div>
                  <div className="text-xs text-[#34495e] font-semibold mb-1 flex items-center gap-2">
                    Source
                    <TooltipInfo text="Where this listing is originally posted (e.g., StreetEasy, Compass, RentHop, etc.)." />
                  </div>
                  <MarketplaceFilter
                    allMarketplaces={allMarketplaces}
                    tempMarketplaces={tempMarketplaces}
                    setTempMarketplaces={setTempMarketplaces}
                    mobile={true}
                  />
                </div>
              </div>
              <div className="mt-8 flex">
                <button
                  className="flex-1 bg-[#34495e] text-white py-3 font-semibold text-lg"
                  onClick={applyMobileFilters}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
