import React, { useState, useEffect, useRef } from "react";
import location from "../assets/svg/location-svgrepo-com.svg";
import dropdown from "../assets/svg/dropdown-svgrepo-com.svg";
import more from "../assets/svg/more-circle-svgrepo-com.svg";
import save from "../assets/svg/bookmark-svgrepo-com.svg";


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
          ["price", "beds", "lion", "more"].includes(d) ? null : d
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
          <div className="relative" ref={locationDropdownRef}>
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "location" ? null : "location")
              }
              className="flex items-center gap-2 text-sm text-blue-500 font-semibold hover:underline hover:cursor-pointer"
            >
              <img
                src={location}
                alt="location"
                className="w-4 h-4 text-blue-600"
              />{" "}
              LOCATION
            </button>
            {openDropdown === "location" && (
              <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg rounded p-4 w-80">
                <p className="font-semibold text-gray-800 mb-2">AREAS</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {allAreas.map((area) => (
                    <label key={area} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-blue-600"
                        checked={tempAreas.includes(area)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...tempAreas, area]
                            : tempAreas.filter((a) => a !== area);
                          setTempAreas(updated);
                        }}
                      />
                      <span>{area}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <button
                    className="text-gray-400 hover:underline cursor-pointer"
                    onClick={() => setTempAreas([])}
                  >
                    RESET
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, areas: tempAreas }));
                      setOpenDropdown(null);
                    }}
                  >
                    DONE
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            className="flex flex-wrap items-center gap-6 text-sm text-blue-500 font-semibold relative"
            ref={filtersDropdownRef}
          >
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
                <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg rounded p-4 w-80">
                  <p className="font-semibold text-gray-800 mb-2">PRICE</p>
                  <div className="flex gap-2 mb-4">
                    <div className="flex flex-col w-full">
                      <label className="text-xs text-gray-500 mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="e.g. 1000"
                        value={tempPrice.min}
                        onChange={(e) =>
                          setTempPrice((prev) => ({
                            ...prev,
                            min: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-xs text-gray-500 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="e.g. 6000"
                        value={tempPrice.max}
                        onChange={(e) =>
                          setTempPrice((prev) => ({
                            ...prev,
                            max: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <button
                      className="text-gray-400 hover:underline cursor-pointer"
                      onClick={() => {
                        setTempPrice({ min: "", max: "" });
                        setFilters((prev) => ({
                          ...prev,
                          minPrice: 0,
                          maxPrice: 10000,
                        }));
                      }}
                    >
                      RESET
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          minPrice: parseInt(tempPrice.min) || 0,
                          maxPrice: parseInt(tempPrice.max) || 10000,
                        }));
                        setOpenDropdown(null);
                      }}
                    >
                      DONE
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "beds" ? null : "beds")
                }
                className="flex items-center gap-1 hover:underline hover:cursor-pointer"
              >
                BEDS / BATHS{" "}
                <img src={dropdown} alt="dropdown" className="w-3 h-3" />
              </button>
              {openDropdown === "beds" && (
                <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg rounded p-4 w-100">
                  <p className="font-semibold text-gray-800 mb-1">BEDROOMS</p>
                  <p className="text-xs text-gray-500 mb-2">Choose a filter</p>
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {["Any", "Studio", 1, 2, 3, "4+"].map((label) => (
                      <button
                        key={label}
                        className={`border px-2 py-1 rounded text-sm hover:bg-blue-50 ${
                          tempBed === label ? "bg-blue-100" : ""
                        }`}
                        onClick={() => setTempBed(label)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="font-semibold text-gray-800 mb-1">BATHROOMS</p>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {["Any", "1+", "1.5+", "2+", "3+"].map((label) => (
                      <button
                        key={label}
                        className={`border px-2 py-1 rounded text-sm hover:bg-blue-50 ${
                          tempBath === label ? "bg-blue-100" : ""
                        }`}
                        onClick={() => setTempBath(label)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm">
                    <button
                      className="text-gray-400 hover:underline cursor-pointer"
                      onClick={() => {
                        setTempBed("any");
                        setTempBath("any");
                        setFilters((prev) => ({
                          ...prev,
                          bedrooms: "any",
                          bathrooms: "any",
                        }));
                        setOpenDropdown(null);
                      }}
                    >
                      RESET
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:cursor-pointer"
                      onClick={() => {
                        const parsedBed = tempBed === "Studio" ? 0.5 : tempBed;
                        const parsedBath = tempBath.replace("+", "");
                        setFilters((prev) => ({
                          ...prev,
                          bedrooms: parsedBed === "Any" ? "any" : parsedBed,
                          bathrooms: parsedBath === "Any" ? "any" : parsedBath,
                        }));
                        setOpenDropdown(null);
                      }}
                    >
                      DONE
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg rounded p-4 w-80">
                  <p className="font-semibold text-gray-800 mb-2">LION SCORE</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      "✅ Reasonable",
                      "🔥 Steal Deal",
                      "🚨 Too Cheap to Be True",
                      "💸 Overpriced",
                    ].map((score) => (
                      <label key={score} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="accent-blue-600"
                          checked={tempLionScores.includes(score)}
                          onChange={(e) => {
                            const updatedScores = e.target.checked
                              ? [...tempLionScores, score]
                              : tempLionScores.filter((s) => s !== score);
                            setTempLionScores(updatedScores);
                          }}
                        />
                        <span>{score}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm mt-3">
                    <button
                      className="text-gray-400 hover:underline cursor-pointer"
                      onClick={() =>
                        setTempLionScores([
                          "✅ Reasonable",
                          "🔥 Steal Deal",
                          "🚨 Too Cheap to Be True",
                          "💸 Overpriced",
                        ])
                      }
                    >
                      RESET
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          lionScores: tempLionScores,
                        }));
                        setOpenDropdown(null);
                      }}
                    >
                      DONE
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "more" ? null : "more")
                }
                className="flex items-center gap-2 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
              >
                <img src={more} alt="more filters" className="w-4 h-4" /> MORE
              </button>
              {openDropdown === "more" && (
                <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg rounded p-4 w-80">
                  <p className="font-semibold text-gray-800 mb-2">
                    More Filters
                  </p>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={tempFilters.onlyNoFee}
                      onChange={(e) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          onlyNoFee: e.target.checked,
                        }))
                      }
                    />
                    No Fee Only
                  </label>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={tempFilters.onlyFeatured}
                      onChange={(e) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          onlyFeatured: e.target.checked,
                        }))
                      }
                    />
                    Featured Only
                  </label>
                  <div className="mt-2">
                    <label className="text-xs text-gray-500 mb-1 block">
                      Max Complaints
                    </label>
                    <input
                      type="number"
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                      value={tempFilters.maxComplaints}
                      onChange={(e) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          maxComplaints: parseInt(e.target.value) || 100,
                        }))
                      }
                      placeholder="e.g. 10"
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-3">
                    <button
                      className="text-gray-400 hover:underline cursor-pointer"
                      onClick={() =>
                        setTempFilters({
                          onlyNoFee: false,
                          onlyFeatured: false,
                          maxComplaints: 100,
                        })
                      }
                    >
                      RESET
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          ...tempFilters,
                        }));
                        setOpenDropdown(null);
                      }}
                    >
                      DONE
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button className="border border-gray-300 px-4 py-2 rounded font-semibold hover:bg-blue-100 hover:cursor-pointer text-sm flex items-center gap-2">
            <img src={save} alt="save search" className="w-4 h-4" /> SAVE SEARCH
          </button>
        </div>
      </div>
    </header>
  );
}
