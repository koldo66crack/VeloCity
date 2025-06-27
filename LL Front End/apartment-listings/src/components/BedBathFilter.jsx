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
  mobile = false, // Add this prop; parent passes mobile={true} inside modal
}) {
  const content = (
    <div className="w-[28rem] max-w-full">
      <p className="font-semibold text-gray-200 mb-2 text-sm">Bedrooms</p>
      <p className="text-xs text-gray-400 mb-3">Choose a filter</p>
      <div className="grid grid-cols-6 gap-2 mb-4">
        {["Any", "Studio", 1, 2, 3, "4+"].map((label) => (
          <button
            key={label}
            className={`border border-gray-600 px-2 py-1.5 text-xs rounded hover:bg-gray-700 transition-colors ${
              tempBed === label ? "bg-green-600 text-white border-green-500" : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setTempBed(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="font-semibold text-gray-200 mb-2 text-sm">Bathrooms</p>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {["Any", "1+", "1.5+", "2+", "3+"].map((label) => (
          <button
            key={label}
            className={`border border-gray-600 px-2 py-1.5 text-xs rounded hover:bg-gray-700 transition-colors ${
              tempBath === label ? "bg-green-600 text-white border-green-500" : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setTempBath(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {!mobile && (
        <div className="flex justify-between text-xs">
          <button
            className="text-gray-400 hover:text-white hover:underline cursor-pointer"
            onClick={() => {
              setTempBed("any");
              setTempBath("any");
              if (setFilters && setOpenDropdown) {
                setFilters((prev) => ({
                  ...prev,
                  bedrooms: "any",
                  bathrooms: "any",
                }));
                setOpenDropdown(null);
              }
              // On mobile, only update local state
            }}
          >
            Reset
          </button>
          {/* Only render Done if setFilters && setOpenDropdown exist (desktop). On mobile, handled by modal parent */}
          {setFilters && setOpenDropdown && (
            <button
              className="bg-green-600 text-white px-4 py-1.5 rounded cursor-pointer hover:bg-green-700 transition-colors"
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
              Done
            </button>
          )}
        </div>
      )}
    </div>
  );

  // Only desktop uses the dropdown wrapper; mobile renders a plain block.
  return mobile ? (
    <div className="bg-gray-800 p-4 rounded-lg">{content}</div>
  ) : (
    <div className="absolute top-full mt-2 left-0 z-50 bg-gray-800 border border-gray-700 shadow-lg p-4 rounded-lg w-[28rem]">
      {content}
    </div>
  );
}
