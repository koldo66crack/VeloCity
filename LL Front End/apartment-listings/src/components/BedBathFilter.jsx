import React from "react";

// #85929e -> blue-50
// #5d6d7e -> blue-100
// #34495e -> blue-500

export default function BedBathFilter({
  tempBed,
  tempBath,
  setTempBed,
  setTempBath,
  setFilters,
  setOpenDropdown,
}) {
  return (
    <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg p-4 w-[28rem]">
      <p className="font-semibold text-gray-800 mb-1">BEDROOMS</p>
      <p className="text-xs text-gray-500 mb-2">Choose a filter</p>
      <div className="grid grid-cols-6 gap-2 mb-4">
        {["Any", "Studio", 1, 2, 3, "4+"].map((label) => (
          <button
            key={label}
            className={`border px-2 py-1 text-sm hover:bg-blue-50 ${
              tempBed === label ? "bg-blue-100" : ""
            }`}
            onClick={() => setTempBed(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="font-semibold text-gray-800 mb-1">BATHROOMS</p>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {["Any", "1+", "1.5+", "2+", "3+"].map((label) => (
          <button
            key={label}
            className={`border px-2 py-1 text-sm hover:bg-blue-50 ${
              tempBath === label ? "bg-blue-100" : ""
            }`}
            onClick={() => setTempBath(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-sm">
        <button
          className="text-gray-400 hover:underline cursor-pointer"
          onClick={() => {
            setTempBed("any");
            setTempBath("any");
            setFilters((prev) => ({
              ...prev,
              bedrooms: "any",
              bathrooms: "any",
            }));
            setOpenDropdown(null);
          }}
        >
          RESET
        </button>
        <button
          className="bg-[#34495e] text-white px-4 py-1 hover:cursor-pointer"
          onClick={() => {
            const parsedBed = tempBed === "Studio" ? 0 : tempBed;
            const parsedBath = tempBath.replace("+", "");
            setFilters((prev) => ({
              ...prev,
              bedrooms: parsedBed === "Any" ? "any" : parsedBed,
              bathrooms: parsedBath === "Any" ? "any" : parsedBath,
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
