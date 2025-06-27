import React from "react";

export default function PriceFilter({
  tempPrice,
  setTempPrice,
  setFilters,
  setOpenDropdown,
  mobile = false,
}) {
  const content = (
    <div className="w-80 max-w-full">
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col w-full">
          <label className="text-xs text-gray-400 mb-1">Min Price</label>
          <input
            type="number"
            className="bg-gray-700 border border-gray-600 text-white text-xs px-3 py-2 rounded-md w-full focus:ring-green-500 focus:border-green-500"
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
          <label className="text-xs text-gray-400 mb-1">Max Price</label>
          <input
            type="number"
            className="bg-gray-700 border border-gray-600 text-white text-xs px-3 py-2 rounded-md w-full focus:ring-green-500 focus:border-green-500"
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
      {!mobile && (
          <div className="flex justify-between text-xs mt-4">
            <button
              className="text-gray-400 hover:text-white hover:underline cursor-pointer"
              onClick={() => {
                setTempPrice({ min: "", max: "" });
                if (setFilters) {
                  setFilters((prev) => ({ ...prev, minPrice: undefined, maxPrice: undefined }));
                }
              }}
            >
              Reset
            </button>
            <button
                className="bg-green-600 text-white px-4 py-1.5 rounded cursor-pointer hover:bg-green-700 transition-colors"
                onClick={() => {
                  if (setFilters) {
                      setFilters((prev) => ({
                          ...prev,
                          minPrice: tempPrice.min ? parseInt(tempPrice.min) : undefined,
                          maxPrice: tempPrice.max ? parseInt(tempPrice.max) : undefined,
                      }));
                  }
                  if (setOpenDropdown) {
                      setOpenDropdown(null);
                  }
                }}
            >
                Done
            </button>
          </div>
      )}
    </div>
  );

  return mobile ? (
    <div className="bg-gray-800 p-4 rounded-lg">{content}</div>
  ) : (
    <div className="absolute top-full mt-2 left-0 z-50 bg-gray-800 border border-gray-700 shadow-lg p-4 rounded-lg w-80">
      {content}
    </div>
  );
}
