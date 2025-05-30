// src/pages/SeniorBlueprint.jsx
import { useState } from "react";

const SCHOOLS = [
  { name: "Columbia", color: "#85929e" },
  { name: "NYU", color: "#5d6d7e" },
  // Add more if needed!
];
const GROUP_SIZES = [1, 2, 3, 4, 5];

const NEIGHBORHOOD_DATA = {
  Columbia: [
    { name: "Morningside Heights", range: "$1300–$1700", pro: "Closest to campus, lots of student buildings", con: "Higher price, demand spikes early" },
    { name: "Hamilton Heights", range: "$1200–$1600", pro: "Quieter, more affordable, walkable", con: "Longer walk to campus" },
    { name: "Washington Heights", range: "$1100–$1400", pro: "Best value, lots of 3-4 beds", con: "Farther, subway ride needed" },
  ],
  NYU: [
    { name: "East Village", range: "$1600–$2200", pro: "Walk to class, tons of food", con: "Can get noisy" },
    { name: "Williamsburg", range: "$1400–$2000", pro: "Trendy, fast train to NYU", con: "Can be pricier, needs subway" },
    { name: "Bed-Stuy", range: "$1100–$1600", pro: "Great value, up-and-coming", con: "Longer commute" },
  ]
};

const CHECKLIST = [
  "Get your documents ready (ID, I-20, bank statement, admission letter)",
  "Know your budget + roommate count",
  "Ask for video tours—never send money without seeing",
  "Check 311 building complaints for red flags",
  "Have a plan for deposit/guarantor (Insurent, TheGuarantors, etc.)"
];

const MISTAKES = [
  "Waiting too long—prices jump and best places go fast.",
  "Assuming you can negotiate in July/August. Act quickly instead.",
  "Not vetting roommates early—delays cost you your dream place.",
  "Ignoring building complaints. Don’t skip 311 or Google reviews."
];

export default function SeniorBlueprint() {
  const [school, setSchool] = useState("Columbia");
  const [groupSize, setGroupSize] = useState(3);

  const neighborhoods = NEIGHBORHOOD_DATA[school] || [];

  return (
    <div className="min-h-screen w-full bg-[#34495e] flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-3xl border border-[#85929e] bg-[#5d6d7e] p-0" style={{ borderRadius: 0 }}>
        <div className="px-8 py-8 flex flex-col gap-8">
          <h2 className="text-2xl text-white font-extrabold uppercase tracking-widest text-center mb-2">
            Senior-Verified Blueprint
          </h2>
          <div className="flex gap-6 items-center mb-8">
            <select
              value={school}
              onChange={e => setSchool(e.target.value)}
              className="bg-[#34495e] text-white px-4 py-2 border border-[#85929e]"
              style={{ borderRadius: 0 }}
            >
              {SCHOOLS.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
            <select
              value={groupSize}
              onChange={e => setGroupSize(Number(e.target.value))}
              className="bg-[#34495e] text-white px-4 py-2 border border-[#85929e]"
              style={{ borderRadius: 0 }}
            >
              {GROUP_SIZES.map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>
          {/* NEIGHBORHOODS */}
          <div>
            <h3 className="text-xl text-[#85929e] font-bold uppercase mb-2">
              Top Neighborhoods For You
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {neighborhoods.map(nb => (
                <div key={nb.name} className="bg-[#34495e] border border-[#85929e] p-4 text-white" style={{ borderRadius: 0 }}>
                  <div className="text-lg font-bold">{nb.name}</div>
                  <div className="text-sm text-[#85929e] font-semibold mb-2">{nb.range}</div>
                  <div className="text-xs mb-1"><span className="font-bold text-[#85929e]">+</span> {nb.pro}</div>
                  <div className="text-xs text-red-300"><span className="font-bold">-</span> {nb.con}</div>
                </div>
              ))}
            </div>
          </div>
          {/* CHECKLIST */}
          <div>
            <h3 className="text-xl text-[#85929e] font-bold uppercase mb-2">NYC Renting Checklist</h3>
            <ul className="list-disc ml-6 text-white">
              {CHECKLIST.map((item, i) => (
                <li key={i} className="mb-1">{item}</li>
              ))}
            </ul>
          </div>
          {/* MISTAKES */}
          <div>
            <h3 className="text-xl text-red-300 font-bold uppercase mb-2">Mistakes To Avoid</h3>
            <ul className="list-disc ml-6 text-red-200">
              {MISTAKES.map((item, i) => (
                <li key={i} className="mb-1">{item}</li>
              ))}
            </ul>
          </div>
          {/* SENIOR CHAT */}
          <div className="text-white text-center mt-8">
            <a
              href="https://chat.whatsapp.com/yourlink"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#85929e] font-bold text-lg"
            >
              Join the Senior Tips Chat &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
