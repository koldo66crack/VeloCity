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
      <p className="font-semibold text-gray-200 mb-3 text-sm">Areas</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {allAreas.map((area) => (
          <label key={area} className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
            <input
              type="checkbox"
              className="accent-green-500"
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
      {!mobile && (
        <div className="flex justify-between text-xs mt-4">
          <button
            className="text-gray-400 hover:text-white hover:underline cursor-pointer"
            onClick={() => setTempAreas([])}
          >
            Reset
          </button>
          {/* Only show "Done" if setFilters and setOpenDropdown are provided (i.e., desktop dropdown) */}
          {setFilters && setOpenDropdown && (
            <button
              className="bg-green-600 text-white px-4 py-1.5 rounded cursor-pointer hover:bg-green-700 transition-colors"
              onClick={() => {
                if (setFilters) setFilters((prev) => ({ ...prev, areas: tempAreas }));
                if (setOpenDropdown) setOpenDropdown(null);
              }}
            >
              Done
            </button>
          )}
        </div>
      )}
    </div>
  );

  // On desktop: absolute dropdown; on mobile: just a block inside modal
  return mobile ? (
    <div className="bg-gray-800 p-4 rounded-lg">{content}</div>
  ) : (
    <div className="absolute top-full mt-2 left-0 z-50 bg-gray-800 border border-gray-700 shadow-lg p-4 rounded-lg w-80">
      {content}
    </div>
  );
}
