import React from "react";

export default function MarketplaceFilter({
  allMarketplaces,
  tempMarketplaces,
  setTempMarketplaces,
  setFilters,
  setOpenDropdown,
}) {

  const handleCheckboxChange = (mp, checked) => {
    const updated = checked
      ? [...tempMarketplaces, mp]
      : tempMarketplaces.filter((m) => m !== mp);
    setTempMarketplaces(updated);
  };

  return (
    <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg p-4 w-80">
      {/* <p className="font-semibold text-gray-800 mb-2">Marketplaces</p> */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {allMarketplaces.map((mp) => (
          <label key={mp} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-[#34495e]"
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
          onClick={() => setTempMarketplaces([...allMarketplaces])}
        >
          RESET
        </button>
        <button
          className="bg-[#34495e] text-white px-4 py-1 cursor-pointer"
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
