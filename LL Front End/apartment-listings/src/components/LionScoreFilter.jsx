import React from "react";

export default function LionScoreFilter({
  tempLionScores,
  setTempLionScores,
  setFilters,
  setOpenDropdown,
  mobile = false, // default: desktop, mobile=true inside modal
}) {
  const lionScoreOptions = [
    "✅ Reasonable",
    "🔥 Steal Deal",
    "🚨 Too Cheap to Be True",
    "💸 Overpriced",
  ];

  const handleCheckboxChange = (score, checked) => {
    const updated = checked
      ? [...tempLionScores, score]
      : tempLionScores.filter((s) => s !== score);
    setTempLionScores(updated);
  };

  const content = (
    <div className="w-80 max-w-full">
      <div className="grid grid-cols-2 gap-2 text-sm">
        {lionScoreOptions.map((score) => (
          <label key={score} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-[#34495e]"
              checked={tempLionScores.includes(score)}
              onChange={(e) => handleCheckboxChange(score, e.target.checked)}
            />
            <span>{score}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between text-sm mt-3">
        <button
          className="text-gray-400 hover:underline cursor-pointer"
          onClick={() => setTempLionScores([...lionScoreOptions])}
        >
          RESET
        </button>
        {setFilters && setOpenDropdown && (
          <button
            className="bg-[#34495e] text-white px-4 py-1 cursor-pointer"
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                lionScores: tempLionScores,
              }));
              setOpenDropdown(null);
            }}
          >
            DONE
          </button>
        )}
      </div>
    </div>
  );

  return mobile ? (
    <div>{content}</div>
  ) : (
    <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg p-4 w-80">
      {content}
    </div>
  );
}
