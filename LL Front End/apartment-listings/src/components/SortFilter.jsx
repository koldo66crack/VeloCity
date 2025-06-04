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
      <div className="flex flex-col gap-2 text-sm">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
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
              className="accent-[#34495e]"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {/* Desktop: show DONE button */}
      {!mobile && (
        <div className="flex justify-end mt-3">
          <button
            className="bg-[#34495e] text-white px-4 py-1 cursor-pointer"
            onClick={() => setOpenDropdown(null)}
          >
            DONE
          </button>
        </div>
      )}
    </div>
  );
}
