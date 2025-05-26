import React from "react";

export default function PriceFilter({
  tempPrice,
  setTempPrice,
  setFilters,
  setOpenDropdown,
}) {
  return (
    <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg p-4 w-80">
      {/* <p className="font-semibold text-gray-800 mb-2">PRICE</p> */}
      <div className="flex gap-2 mb-4">
        <div className="flex flex-col w-full">
          <label className="text-xs text-gray-500 mb-1">Min Price</label>
          <input
            type="number"
            className="border border-gray-300 px-2 py-1 w-full"
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
          <label className="text-xs text-gray-500 mb-1">Max Price</label>
          <input
            type="number"
            className="border border-gray-300 px-2 py-1 w-full"
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
          className="bg-[#34495e] text-white px-4 py-1 cursor-pointer"
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
  );
}
