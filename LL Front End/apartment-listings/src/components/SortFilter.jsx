import React from "react";

export default function SortFilter({
  value,
  setValue,
  setFilters,
  setOpenDropdown,
  mobile = false, // true inside modal, false for dropdown
}) {
  const options = [
    { label: "Default", value: "original" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Proximity: Closest First", value: "distance-asc" },
    { label: "Proximity: Furthest First", value: "distance-desc" },
  ];

  return (
    <div className={`w-72 max-w-full ${!mobile ? "p-4" : ""}`}>
      <div className="flex flex-col gap-2 text-xs">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
            <input
              type="radio"
              name={mobile ? "mobileSortOption" : "sortOption"}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => {
                setValue(opt.value);
                // On desktop, apply instantly
                if (setFilters && setOpenDropdown) {
                  setFilters((prev) => ({ ...prev, sortOption: opt.value }));
                  setOpenDropdown(null);
                }
              }}
              className="accent-green-500"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {/* Desktop: show Done button */}
      {!mobile && (
        <div className="flex justify-end mt-4">
          <button
            className="bg-green-600 text-white px-4 py-1.5 rounded cursor-pointer hover:bg-green-700 transition-colors text-xs"
            onClick={() => setOpenDropdown(null)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
