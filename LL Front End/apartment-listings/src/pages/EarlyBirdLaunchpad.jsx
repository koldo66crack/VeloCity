// src/pages/EarlyBirdLaunchpad.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const stepsData = [
  {
    key: "moveIn",
    label: "Set your move-in date & roommate count",
    render: ({ stepState, setStepState }) => (
      <div className="flex flex-col gap-3">
        <input
          type="date"
          value={stepState.moveInDate || ""}
          onChange={e => setStepState(s => ({ ...s, moveInDate: e.target.value }))}
          className="px-3 py-2 bg-[#34495e] border border-[#85929e] text-white"
          style={{ borderRadius: 0 }}
        />
        <input
          type="number"
          placeholder="Number of roommates"
          min={1}
          max={6}
          value={stepState.roommateCount || ""}
          onChange={e => setStepState(s => ({ ...s, roommateCount: e.target.value }))}
          className="px-3 py-2 bg-[#34495e] border border-[#85929e] text-white"
          style={{ borderRadius: 0 }}
        />
      </div>
    ),
    isComplete: state => !!state.moveInDate && !!state.roommateCount,
  },
  {
    key: "neighborhoods",
    label: "See last year's best neighborhoods & prices",
    render: () => (
      <div className="text-white">
        <b className="text-[#85929e]">Morningside Heights:</b> $1300–$1700<br />
        <b className="text-[#85929e]">Hamilton Heights:</b> $1200–$1600<br />
        <b className="text-[#85929e]">Washington Heights:</b> $1100–$1400<br />
        (Data: 2023 Columbia/NYC students)
      </div>
    ),
    isComplete: () => true,
  },
  {
    key: "seniors",
    label: "Join the Senior Tips chat",
    render: () => (
      <div className="text-white">
        <a
          href="https://chat.whatsapp.com/yourlink" // <-- Put your group link
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#85929e] font-bold"
        >
          Click to join the WhatsApp group for real-time advice!
        </a>
      </div>
    ),
    isComplete: () => true,
  },
  {
    key: "wishlist",
    label: "Compare your wish list",
    render: ({ stepState, setStepState }) => (
      <div className="flex flex-wrap gap-3">
        {["Laundry", "Elevator", "2+ Bathrooms", "Gym", "Near Columbia"].map(option => (
          <label key={option} className="text-white flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!stepState[option]}
              onChange={e => setStepState(s => ({ ...s, [option]: e.target.checked }))}
              className="accent-[#85929e] w-5 h-5"
              style={{ borderRadius: 0 }}
            />
            {option}
          </label>
        ))}
      </div>
    ),
    isComplete: state =>
      ["Laundry", "Elevator", "2+ Bathrooms", "Gym", "Near Columbia"].some(k => !!state[k]),
  },
];

export default function EarlyBirdLaunchpad() {
  const navigate = useNavigate();
  const [stepState, setStepState] = useState({});
  const progress =
    (stepsData.filter(step => step.isComplete(stepState)).length / stepsData.length) * 100;

  return (
    <div className="min-h-screen bg-[#34495e] flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-2xl border border-[#85929e] bg-[#5d6d7e] p-0" style={{ borderRadius: 0 }}>
        {/* Progress Bar */}
        <div className="w-full h-6 bg-[#34495e] border-b-2 border-[#85929e]">
          <div
            className="h-full bg-[#85929e] transition-all duration-300"
            style={{ width: `${progress}%`, borderRadius: 0 }}
          />
        </div>
        <div className="px-8 py-8 flex flex-col gap-8">
          <h2 className="text-2xl text-white font-extrabold uppercase tracking-widest text-center mb-2">
            Early Bird Launchpad
          </h2>
          {stepsData.map((step, idx) => (
            <div
              key={step.key}
              className={`border-l-4 pl-4 py-4 mb-4 ${step.isComplete(stepState) ? 'border-[#85929e] bg-[#34495e]' : 'border-gray-600 bg-[#5d6d7e]'}`}
              style={{ borderRadius: 0 }}
            >
              <div className="text-xl font-bold text-white mb-2 uppercase">
                {step.label}
                {step.isComplete(stepState) && (
                  <span className="ml-3 text-[#85929e] font-extrabold">✓</span>
                )}
              </div>
              {step.render({ stepState, setStepState })}
            </div>
          ))}
          <button
            disabled={progress < 100}
            onClick={() => navigate("/home")}
            className={`w-full py-4 bg-[#34495e] text-white font-bold uppercase tracking-wide ${progress < 100 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#232f3e] cursor-pointer'}`}
            style={{ borderRadius: 0, letterSpacing: '0.09em' }}
          >
            {progress < 100 ? "Complete all steps to proceed" : "Search Rentals Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
