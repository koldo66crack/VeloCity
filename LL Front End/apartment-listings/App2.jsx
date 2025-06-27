import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import listingsData from "./data/combined_listings_with_lionscore.json";

import ListingDetailPage from "./components/ListingDetailPage";
import ListingCard from "./components/ListingCard";
import MapView from "./components/MapViewGoogle";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";

import Flip from "./pages/FlipCards";
import HeatMap from "./pages/AmenitiesHeatmap";
import SwipeListings from "./pages/SwipeListings";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

import location from "./assets/svg/location-svgrepo-com.svg";
import dropdown from "./assets/svg/dropdown-svgrepo-com.svg";
import more from "./assets/svg/more-circle-svgrepo-com.svg";
import save from "./assets/svg/bookmark-svgrepo-com.svg";

import ProtectedRoute from "./components/ProtectedRoute";

// console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
// console.log("Google Maps Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

function HomePage() {
  const [listings, setListings] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [viewMode, setViewMode] = useState("split");
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
  const [tempAreas, setTempAreas] = useState([]);
  const [activeListing, setActiveListing] = useState(null);
  const [hoveredListing, setHoveredListing] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [tempPrice, setTempPrice] = useState({ min: "", max: "" });
  const [tempBed, setTempBed] = useState("any");
  const [tempBath, setTempBath] = useState("any");
  const [tempLionScores, setTempLionScores] = useState(filters.lionScores);
  const [tempFilters, setTempFilters] = useState({
    maxComplaints: filters.maxComplaints,
    onlyNoFee: filters.onlyNoFee,
    onlyFeatured: filters.onlyFeatured,
  });
  const locationDropdownRef = useRef();
  const filtersDropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const inferArea = (listing) => {
      const zip = listing.addr_zip;
      const street = listing.addr_street?.toUpperCase() || "";
      const lat = listing.addr_lat;
      const lng = listing.addr_lon;

      if (
        zip === "10025" ||
        street.includes("103RD") ||
        street.includes("104")
      ) {
        return "Morningside Heights";
      } else if (
        zip === "10027" ||
        street.includes("ST NICHOLAS") ||
        street.includes("135")
      ) {
        return "Harlem";
      } else if (zip === "10031") {
        return "Hamilton Heights";
      } else if (zip === "10024" || zip === "10023") {
        return "Upper West Side";
      } else if (zip === "10026" || zip === "10029") {
        return "Manhattan Valley";
      } else if (lat && lng) {
        if (lat > 40.805 && lat < 40.82 && lng > -73.96 && lng < -73.94)
          return "Morningside Heights";
        if (lat > 40.812 && lat < 40.827 && lng > -73.95 && lng < -73.93)
          return "Manhattanville";
        if (lat > 40.83 && lng < -73.95) return "Harlem";
      }
      return "Unknown";
    };

    const listingsWithScores = listingsData.map((listing, index) => ({
      ...listing,
      id: index,
      area_name: listing.area_name || inferArea(listing),
      rating: Math.floor(Math.random() * 6),
    }));

    setListings(listingsWithScores);
  }, []);

  useEffect(() => {
    const listingsWithScores = listingsData.map((listing, index) => ({
      ...listing,
      id: index,
      rating: Math.floor(Math.random() * 6),
    }));
    setListings(listingsWithScores);
  }, []);

  const allAreas = Array.from(
    new Set(listingsData.map((l) => l.area_name).filter(Boolean))
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown((prev) => (prev === "location" ? null : prev));
      }
      if (
        filtersDropdownRef.current &&
        !filtersDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown((prev) =>
          prev === "price" ||
          prev === "beds" ||
          prev === "lion" ||
          prev === "more"
            ? null
            : prev
        );
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredListings = listings.filter((listing) => {
    const price = listing.price || listing.net_effective_price || 0;
    const bedrooms =
      listing.bedrooms ??
      (listing.rooms_description?.toLowerCase().includes("studio")
        ? 0.5
        : null);
    const bathrooms = listing.bathrooms ?? null;
    const complaints = listing.building_complaints || {};
    const totalComplaints = Object.values(complaints).reduce(
      (sum, count) => sum + count,
      0
    );

    const matchesBeds =
      filters.bedrooms === "any" ||
      (filters.bedrooms === "4+"
        ? bedrooms >= 4
        : filters.bedrooms === "Studio"
        ? bedrooms === 0.5
        : bedrooms === parseFloat(filters.bedrooms));
    const matchesBaths =
      filters.bathrooms === "any" ||
      parseFloat(bathrooms) >= parseFloat(filters.bathrooms);
    const matchesArea =
      filters.areas.length === 0 || filters.areas.includes(listing.area_name);

    console.log({
      id: listing.id,
      title: listing.title,
      marketplace: listing.marketplace,
      price,
      bedrooms,
      bathrooms,
      area: listing.area_name,
      lionScore: listing.LionScore,
      complaints: totalComplaints,
      passes: {
        price: filters.minPrice === null || price >= filters.minPrice,
        priceMax: filters.maxPrice === null || price <= filters.maxPrice,
        beds: matchesBeds,
        baths: matchesBaths,
        lion:
          filters.lionScores.length === 0 ||
          filters.lionScores.includes(listing.LionScore),
        complaints: totalComplaints <= filters.maxComplaints,
        noFee: !filters.onlyNoFee || listing.no_fee === true,
        featured: !filters.onlyFeatured || listing.is_featured,
        area: matchesArea,
      },
    });

    return (
      (filters.minPrice === null || price >= filters.minPrice) &&
      (filters.maxPrice === null || price <= filters.maxPrice) &&
      matchesBeds &&
      matchesBaths &&
      (filters.lionScores.length === 0 ||
        filters.lionScores.includes(listing.LionScore)) &&
      totalComplaints <= filters.maxComplaints &&
      (!filters.onlyNoFee || listing.no_fee === true) &&
      (!filters.onlyFeatured || listing.is_featured) &&
      matchesArea
    );
  });

  const handleListingClick = (listing) => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <>
      {/* <main className=""> */}
      <header className="bg-gray-100 border-b border-gray-200 sticky top-[64px] z-5000">
        <div className=" mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative" ref={locationDropdownRef}>
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "location" ? null : "location"
                  )
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
                    <p className="text-xs text-gray-500 mb-2">
                      Choose a filter
                    </p>
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
                    <p className="font-semibold text-gray-800 mb-1">
                      BATHROOMS
                    </p>
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
                          const parsedBed =
                            tempBed === "Studio" ? 0.5 : tempBed;
                          const parsedBath = tempBath.replace("+", "");
                          setFilters((prev) => ({
                            ...prev,
                            bedrooms: parsedBed === "Any" ? "any" : parsedBed,
                            bathrooms:
                              parsedBath === "Any" ? "any" : parsedBath,
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
                    <p className="font-semibold text-gray-800 mb-2">
                      LION SCORE
                    </p>
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
              <img src={save} alt="save search" className="w-4 h-4" /> SAVE
              SEARCH
            </button>
          </div>
        </div>
      </header>

      <div className=" mt-25 mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {filteredListings.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">
              No listings match your filters
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your price range or other filters
            </p>
          </div>
        ) : (
          <>
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() =>
                      window.open(`/listing/${listing.id}`, "_blank")
                    }
                    className="cursor-pointer"
                  >
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            )}

            {viewMode === "split" && (
              <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
                <div className="lg:w-1/2 h-full overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredListings.map((listing, index) => (
                      <div
                        key={listing.id}
                        className={`transition-all ${
                          activeListing === index || hoveredListing === index
                            ? "ring-2 ring-indigo-500 scale-[1.02]"
                            : ""
                        }`}
                        onMouseEnter={() => setHoveredListing(index)}
                        onMouseLeave={() => setHoveredListing(null)}
                        onClick={() => handleListingClick(listing)}
                      >
                        <ListingCard listing={listing} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:w-1/2 h-full">
                  <MapView
                    listings={filteredListings}
                    activeListing={activeListing}
                    setActiveListing={setActiveListing}
                    onListingClick={(listing) =>
                      window.open(`/listing/${listing.id}`, "_blank")
                    }
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* </main> */}
    </>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/views/flip" element={<Flip />} />
        <Route path="/views/heatmap" element={<HeatMap />} />
        <Route path="/views/swipe" element={<SwipeListings />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* protected */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/:uid"
          element={
            <ProtectedRoute>
              <HomePage /> {/* whatever component shows all listings */}
            </ProtectedRoute>
          }
        />
      </Routes>
      <AuthModal />
    </>
  );
}