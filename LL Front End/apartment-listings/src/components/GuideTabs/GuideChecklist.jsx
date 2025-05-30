// src/components/GuideTabs/GuideChecklist.jsx
import { useState } from "react";

const checklistItems = [
  { label: "Figured out solo vs roommates?", key: "roommates", weight: 0.22 },
  { label: "Decided your move-in date?", key: "moveIn", weight: 0.18 },
  { label: "Set a budget?", key: "budget", weight: 0.16 },
  { label: "Picked proximity to Columbia?", key: "proximity", weight: 0.15 },
  { label: "Selected must-have amenities?", key: "amenities", weight: 0.13 },
  { label: "Proximity to other essentials?", key: "others", weight: 0.10 },
  { label: "You started early (May–June)", key: "early", weight: 0.06 },
];

export default function GuideChecklist() {
  const [checks, setChecks] = useState({});

  const progress = checklistItems.reduce(
    (acc, item) => acc + (checks[item.key] ? item.weight : 0),
    0
  );

  return (
    <section>
      <h2 className="text-2xl font-bold text-[#34495e] mb-2 uppercase">Checklist: When To Search?</h2>
      <div className="w-full h-4 bg-gray-200 mb-6" style={{ borderRadius: 0 }}>
        <div
          className="h-full bg-[#34495e] transition-all"
          style={{ width: `${Math.round(progress * 100)}%`, borderRadius: 0 }}
        ></div>
      </div>
      <ul className="space-y-3">
        {checklistItems.map((item) => (
          <li key={item.key} className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={!!checks[item.key]}
              onChange={() => setChecks((c) => ({ ...c, [item.key]: !c[item.key] }))}
              className="accent-[#34495e] w-6 h-6"
              style={{ borderRadius: 0 }}
            />
            <span className="text-lg text-black">{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-[#34495e] font-bold">
        {Math.round(progress * 100)}% Ready
      </div>
    </section>
  );
}
