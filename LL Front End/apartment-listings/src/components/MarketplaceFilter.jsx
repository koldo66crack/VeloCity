import React from "react";

export default function MarketplaceFilter({
  tempMarketplaces,
  setTempMarketplaces,
  setFilters,
  setOpenDropdown,
}) {
  const availableMarketplaces = ["Compass", "RentHop", "StreetEasy"];

  const handleCheckboxChange = (mp, checked) => {
    const updated = checked
      ? [...tempMarketplaces, mp]
      : tempMarketplaces.filter((m) => m !== mp);
    setTempMarketplaces(updated);
  };

  return (
    <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg rounded p-4 w-80">
      {/* <p className="font-semibold text-gray-800 mb-2">Marketplaces</p> */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {availableMarketplaces.map((mp) => (
          <label key={mp} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={tempMarketplaces.includes(mp)}
              onChange={(e) => handleCheckboxChange(mp, e.target.checked)}
            />
            <span>{mp}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between text-sm mt-3">
        <button
          className="text-gray-400 hover:underline cursor-pointer"
          onClick={() => setTempMarketplaces([...availableMarketplaces])}
        >
          RESET
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              marketplaces: tempMarketplaces,
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
