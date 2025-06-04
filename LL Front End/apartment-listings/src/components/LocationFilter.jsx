import React from "react";

export default function LocationFilter({
  allAreas,
  tempAreas,
  setTempAreas,
  setFilters,
  setOpenDropdown,
  mobile = false, // Pass this prop as true inside the modal, or omit
}) {
  const content = (
    <div className="w-80 max-w-full">
      <p className="font-semibold text-gray-800 mb-2">AREAS</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {allAreas.map((area) => (
          <label key={area} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-[#34495e]"
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
        {/* Only show "DONE" if setFilters and setOpenDropdown are provided (i.e., desktop dropdown) */}
        {setFilters && setOpenDropdown && (
          <button
            className="bg-[#34495e] text-white px-4 py-1 cursor-pointer"
            onClick={() => {
              if (setFilters) setFilters((prev) => ({ ...prev, areas: tempAreas }));
              if (setOpenDropdown) setOpenDropdown(null);
            }}
          >
            DONE
          </button>
        )}
      </div>
    </div>
  );

  // On desktop: absolute dropdown; on mobile: just a block inside modal
  return mobile ? (
    <div>{content}</div>
  ) : (
    <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg p-4 w-80">
      {content}
    </div>
  );
}
