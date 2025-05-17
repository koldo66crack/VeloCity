import React from "react";

export default function MoreFilters({
  tempFilters,
  setTempFilters,
  setFilters,
  setOpenDropdown,
}) {
  return (
    <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg rounded p-4 w-80">
      {/* <p className="font-semibold text-gray-800 mb-2">More Filters</p> */}

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
  );
}
