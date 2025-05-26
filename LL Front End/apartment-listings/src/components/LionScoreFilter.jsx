import React from "react";

export default function LionScoreFilter({
  tempLionScores,
  setTempLionScores,
  setFilters,
  setOpenDropdown,
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

  return (
    <div className="absolute top-7 left-0 z-50 bg-white border border-gray-300 shadow-lg p-4 w-80">
      {/* <p className="font-semibold text-gray-800 mb-2">LION SCORE</p> */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {lionScoreOptions.map((score) => (
          <label key={score} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-[#34495e]"
              checked={tempLionScores.includes(score)}
              onChange={(e) =>
                handleCheckboxChange(score, e.target.checked)
              }
            />
            <span>{score}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between text-sm mt-3">
        <button
          className="text-gray-400 hover:underline cursor-pointer"
          onClick={() =>
            setTempLionScores([...lionScoreOptions])
          }
        >
          RESET
        </button>
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
      </div>
    </div>
  );
}
