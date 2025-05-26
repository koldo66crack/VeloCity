import React from "react";

export default function LocationFilter({
  allAreas,
  tempAreas,
  setTempAreas,
  setFilters,
  setOpenDropdown,
}) {
  return (
    <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg p-4 w-80">
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
        <button
          className="bg-[#34495e] text-white px-4 py-1 cursor-pointer"
          onClick={() => {
            setFilters((prev) => ({ ...prev, areas: tempAreas }));
            setOpenDropdown(null);
          }}
        >
          DONE
        </button>
      </div>
    </div>
  );
}
