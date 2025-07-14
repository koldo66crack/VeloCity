import React, { useState, useEffect, useRef } from "react";

import LocationFilter from "./LocationFilter";
import SortFilter from "./SortFilter";
import PriceFilter from "./PriceFilter";
import BedBathFilter from "./BedBathFilter";
import TooltipInfo from "./TooltipInfo";

// Helper: A styled button for our filters
const FilterButton = ({ onClick, children, isActive }) => (
  <button
    onClick={onClick}
    className={`relative group flex items-center justify-between w-full md:w-auto md:min-w-[160px] bg-gray-800 text-gray-300 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-300 text-sm ${
      isActive ? "text-green-400" : "hover:text-white"
    }`}
  >
    <div className="flex items-center gap-2">
        {children}
    </div>
    {/* Static corner borders */}
    <span className="absolute top-0 left-0 w-1/4 h-0.5 bg-green-400"></span>
    <span className="absolute top-0 left-0 w-0.5 h-1/3 bg-green-400"></span>
    <span className="absolute bottom-0 right-0 w-1/4 h-0.5 bg-green-400"></span>
    <span className="absolute bottom-0 right-0 w-0.5 h-1/3 bg-green-400"></span>
  </button>
);

// Helper: StreetEasy Toggle Switch
const StreetEasyToggle = ({ enabled, setEnabled }) => (
  <div className="flex items-center gap-3 text-xs text-gray-300">
     <span className={!enabled ? 'text-green-400 font-semibold' : ''}>Only on StreetEasy</span>
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors duration-300 focus:outline-none ${
        enabled ? "bg-green-500" : "bg-gray-600"
      }`}
    >
      <span
        className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform duration-300 ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
    <span className={enabled ? 'text-green-400 font-semibold' : ''}>NOT on StreetEasy</span>
  </div>
);

// Main Filter Panel Component
export default function FilterPanel({
  filters,
  setFilters,
  allAreas,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Local state for desktop filters
  const [tempAreas, setTempAreas] = useState(filters.areas);
  const [tempPrice, setTempPrice] = useState({
    min: filters.minPrice ?? "",
    max: filters.maxPrice ?? "",
  });
  const [tempBed, setTempBed] = useState(filters.bedrooms);
  const [tempBath, setTempBath] = useState(filters.bathrooms);
  
  // StreetEasy toggle state - default to true (show listings NOT on StreetEasy)
  const [streetEasyToggle, setStreetEasyToggle] = useState(true);

  // Temporary states for mobile modal
  const [mobileTempAreas, setMobileTempAreas] = useState(filters.areas);
  const [mobileTempPrice, setMobileTempPrice] = useState({
    min: filters.minPrice ?? "",
    max: filters.maxPrice ?? "",
  });
  const [mobileTempBed, setMobileTempBed] = useState(filters.bedrooms);
  const [mobileTempBath, setMobileTempBath] = useState(filters.bathrooms);
  const [tempSortOption, setTempSortOption] = useState(filters.sortOption ?? "original");
  const [mobileStreetEasyToggle, setMobileStreetEasyToggle] = useState(true);

  const dropdownRefs = {
    location: useRef(),
    sort: useRef(),
    price: useRef(),
    beds: useRef(),
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        Object.values(dropdownRefs).every(
          (ref) => ref.current && !ref.current.contains(e.target)
        )
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mobile Modal management
  useEffect(() => {
    if (!showMobileModal) return;
    const handleKey = (e) => e.key === "Escape" && setShowMobileModal(false);
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [showMobileModal]);

  const openMobileModal = () => {
    // Sync temp states with main filters when opening
    setMobileTempAreas(filters.areas);
    setMobileTempPrice({ min: filters.minPrice ?? "", max: filters.maxPrice ?? "" });
    setMobileTempBed(filters.bedrooms);
    setMobileTempBath(filters.bathrooms);
    setTempSortOption(filters.sortOption ?? "original");
    setMobileStreetEasyToggle(streetEasyToggle);
    setShowMobileModal(true);
  };

  const applyMobileFilters = () => {
    const normBed = mobileTempBed === "Any" ? undefined : mobileTempBed === "Studio" ? 0 : mobileTempBed;
    const normBath = mobileTempBath === "Any" ? undefined : mobileTempBath;
    setFilters((prev) => ({
      ...prev,
      areas: mobileTempAreas,
      minPrice: mobileTempPrice.min || undefined,
      maxPrice: mobileTempPrice.max || undefined,
      bedrooms: normBed,
      bathrooms: normBath,
      sortOption: tempSortOption,
      streetEasyToggle: mobileStreetEasyToggle,
    }));
    setStreetEasyToggle(mobileStreetEasyToggle);
    setShowMobileModal(false);
  };
  
  const activeCount = [
    filters.areas?.length > 0,
    filters.minPrice || filters.maxPrice,
    filters.bedrooms !== undefined,
    filters.bathrooms !== undefined,
    filters.sortOption !== "original",
    filters.streetEasyToggle !== undefined,
  ].filter(Boolean).length;

  const renderDropdown = (filterName) => {
    switch(filterName) {
        case 'location':
            return <LocationFilter allAreas={allAreas} tempAreas={tempAreas} setTempAreas={setTempAreas} setFilters={setFilters} setOpenDropdown={setOpenDropdown} />;
        case 'sort':
            return <div className="absolute top-full mt-2 left-0 z-50 bg-gray-800 border border-gray-700 shadow-lg rounded-lg"><SortFilter value={filters.sortOption || 'original'} setValue={(v) => setFilters(prev => ({...prev, sortOption: v}))} setFilters={setFilters} setOpenDropdown={setOpenDropdown} /></div>;
        case 'price':
            return <PriceFilter tempPrice={tempPrice} setTempPrice={setTempPrice} setFilters={setFilters} setOpenDropdown={setOpenDropdown} />;
        case 'beds':
            return <BedBathFilter tempBed={tempBed} tempBath={tempBath} setTempBed={setTempBed} setTempBath={setTempBath} setFilters={setFilters} setOpenDropdown={setOpenDropdown} />;
        default:
            return null;
    }
  }

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-[64px] z-20">
      <div className=" mx-auto px-4 py-3 sm:px-6 lg:px-8">
        
        {/* --------- DESKTOP VERSION --------- */}
        <div className="hidden md:flex justify-center flex-wrap items-center gap-3">
            {/* NEIGHBORHOOD */}
            <div className="relative" ref={dropdownRefs.location}>
                <FilterButton onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')} isActive={openDropdown === 'location' || filters.areas?.length > 0}>
                    <span className="font-medium">Neighborhood</span>
                </FilterButton>
                {openDropdown === 'location' && renderDropdown('location')}
            </div>

            {/* SORT */}
            <div className="relative" ref={dropdownRefs.sort}>
                <FilterButton onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')} isActive={openDropdown === 'sort' || (filters.sortOption && filters.sortOption !== 'original')}>
                    <span className="font-medium">Sort</span>
                </FilterButton>
                {openDropdown === 'sort' && renderDropdown('sort')}
            </div>

            {/* PRICE */}
            <div className="relative" ref={dropdownRefs.price}>
                <FilterButton onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')} isActive={openDropdown === 'price' || filters.minPrice || filters.maxPrice}>
                    <span className="font-medium">Price</span>
                </FilterButton>
                {openDropdown === 'price' && renderDropdown('price')}
            </div>

            {/* BEDS / BATHS */}
            <div className="relative" ref={dropdownRefs.beds}>
                <FilterButton onClick={() => setOpenDropdown(openDropdown === 'beds' ? null : 'beds')} isActive={openDropdown === 'beds' || filters.bedrooms !== undefined || filters.bathrooms !== undefined}>
                    <span className="font-medium">Beds / Baths</span>
                </FilterButton>
                {openDropdown === 'beds' && renderDropdown('beds')}
            </div>

            {/* STREETEASY TOGGLE */}
            <div className="flex items-center">
                <StreetEasyToggle 
                    enabled={streetEasyToggle} 
                    setEnabled={(enabled) => {
                        setStreetEasyToggle(enabled);
                        setFilters(prev => ({ ...prev, streetEasyToggle: enabled }));
                    }} 
                />
            </div>
        </div>

        {/* --------- MOBILE VERSION --------- */}
        <div className="flex md:hidden items-center">
          <button
            className="w-full flex justify-center items-center bg-gray-800 text-gray-200 font-medium py-2.5 shadow-md border border-gray-700 rounded-lg text-sm relative"
            onClick={openMobileModal}
          >
            <span className="mr-2">Filters</span>
            {activeCount > 0 && (
              <span className="bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold ml-1">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* MOBILE FILTER MODAL */}
        {showMobileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-end md:hidden">
            <div className="w-full max-h-[90vh] bg-gray-900 border-t border-gray-700 rounded-t-2xl shadow-lg p-6 overflow-y-auto animate-fadein">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Filters</h3>
                <button
                  onClick={() => setShowMobileModal(false)}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {/* Neighborhood */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Neighborhood</h4>
                  <LocationFilter allAreas={allAreas} tempAreas={mobileTempAreas} setTempAreas={setMobileTempAreas} mobile={true}/>
                </div>

                {/* Sort */}
                <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Sort</h4>
                    <SortFilter value={tempSortOption} setValue={setTempSortOption} mobile={true} />
                </div>

                {/* Price */}
                <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Price</h4>
                    <PriceFilter tempPrice={mobileTempPrice} setTempPrice={setMobileTempPrice} mobile={true} />
                </div>

                {/* Bed/Bath */}
                <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Beds / Baths</h4>
                    <BedBathFilter tempBed={mobileTempBed} tempBath={mobileTempBath} setTempBed={setMobileTempBed} setTempBath={setMobileTempBath} mobile={true} />
                </div>

                {/* StreetEasy Toggle */}
                <div>
                    <h4 className="text-sm font-semibold text-white mb-2">StreetEasy</h4>
                    <StreetEasyToggle 
                        enabled={mobileStreetEasyToggle} 
                        setEnabled={setMobileStreetEasyToggle} 
                    />
                </div>

              </div>
              <div className="mt-8 flex sticky bottom-0 bg-gray-900 py-4">
                <button
                  className="flex-1 bg-green-600 text-white py-3 font-semibold text-sm rounded-lg hover:bg-green-700 transition-colors"
                  onClick={applyMobileFilters}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
