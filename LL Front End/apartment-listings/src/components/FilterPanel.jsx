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
import TooltipInfo from "./TooltipInfo";

export default function FilterPanel({
  listings,
  filters,
  setFilters,
  allAreas,
  allMarketplaces,
}) {
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

  const [tempMarketplaces, setTempMarketplaces] = useState(
    filters.marketplaces
  );

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
              className="flex items-center gap-2 text-sm text-[#34495e] font-semibold hover:underline hover:cursor-pointer"
            >
              <img src={location} alt="location" className="w-4 h-4" />
              NEIGHBORHOOD
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
            className="flex flex-wrap items-center gap-6 text-sm text-[#34495e] font-semibold relative"
            ref={filtersDropdownRef}
          >
            {/* SORT */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "sort" ? null : "sort")
                }
                className="flex items-center gap-1 hover:underline hover:cursor-pointer"
              >
                SORT
                <img src={dropdown} alt="dropdown" className="w-3 h-3" />
              </button>
              {openDropdown === "sort" && (
                <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg p-4 w-72">
                  <div className="flex flex-col gap-2 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortOption"
                        value="original"
                        checked={filters.sortOption === "original"}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            sortOption: "original",
                          }))
                        }
                        className="accent-[#34495e]"
                      />
                      Default
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortOption"
                        value="price-asc"
                        checked={filters.sortOption === "price-asc"}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            sortOption: "price-asc",
                          }))
                        }
                        className="accent-[#34495e]"
                      />
                      Price: Low to High
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortOption"
                        value="price-desc"
                        checked={filters.sortOption === "price-desc"}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            sortOption: "price-desc",
                          }))
                        }
                        className="accent-[#34495e]"
                      />
                      Price: High to Low
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortOption"
                        value="distance-asc"
                        checked={filters.sortOption === "distance-asc"}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            sortOption: "distance-asc",
                          }))
                        }
                        className="accent-[#34495e]"
                      />
                      Proximity: Closest First
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortOption"
                        value="distance-desc"
                        checked={filters.sortOption === "distance-desc"}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            sortOption: "distance-desc",
                          }))
                        }
                        className="accent-[#34495e]"
                      />
                      Proximity: Furthest First
                    </label>
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      className="bg-[#34495e] text-white px-4 py-1 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      DONE
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                VELO SCORE
                <img src={dropdown} alt="dropdown" className="w-3 h-3" />
                {/* <TooltipInfo
                  text={`VeloScore™ tells you if the apartment's price matches its value:\n
- ✅ Reasonable: You are good to go!
- 🔥 Steal Deal: Jump on this—it's a rare find!
- 🚨 Too Cheap to Be True: Be careful, something's off.
- 💸 Overpriced: You're paying too much for what you get.
      `}
                /> */}
                <TooltipInfo text={`VeloScore™ tells you if the apartment's price matches its value.`} />
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
                SOURCE
                <img src={dropdown} alt="dropdown" className="w-3 h-3" />
                <TooltipInfo text="Where this listing is originally posted (e.g., StreetEasy, Compass, RentHop, etc.)." />
              </button>
              {openDropdown === "marketplace" && (
                <MarketplaceFilter
                  allMarketplaces={allMarketplaces}
                  tempMarketplaces={tempMarketplaces}
                  setTempMarketplaces={setTempMarketplaces}
                  setFilters={setFilters}
                  setOpenDropdown={setOpenDropdown}
                />
              )}
            </div>

            {/* MORE */}
            {/* <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "more" ? null : "more")
                }
                className="flex items-center gap-2 border border-gray-300 px-3 py-1 hover:bg-gray-100"
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
            </div> */}
          </div>

          {/* SAVE SEARCH BUTTON */}
          <button className="border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-300 hover:cursor-pointer text-sm flex items-center gap-2">
            <img src={save} alt="save search" className="w-4 h-4" />
            SAVE PREFERENCES
          </button>
        </div>
      </div>
    </header>
  );
}
