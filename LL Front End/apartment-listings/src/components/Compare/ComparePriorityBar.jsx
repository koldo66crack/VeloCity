import { useState } from "react";

export default function ComparePriorityBar({ priorities, setPriorities, onBack, onNext }) {
  const [current, setCurrent] = useState(priorities);

  function moveUp(idx) {
    if (idx === 0) return;
    const newOrder = [...current];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    setCurrent(newOrder);
  }

  function moveDown(idx) {
    if (idx === current.length - 1) return;
    const newOrder = [...current];
    [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
    setCurrent(newOrder);
  }

  function handleNext() {
    setPriorities(current);
    onNext();
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[#34495e] mb-2 text-center">Arrange Your Priorities</h2>
      <p className="text-black text-center mb-4">Drag or use arrows to rank what matters most to you in this search.<br /><span className="text-[#34495e] font-bold">#1 gets the highest weight!</span></p>
      <ul className="max-w-lg mx-auto">
        {current.map((p, idx) => (
          <li
            key={p}
            className="flex items-center bg-[#f5f6fa] border-2 border-[#34495e] mb-3 py-3 px-5 justify-between"
            style={{ borderRadius: 0 }}
          >
            <span className="font-bold text-black">{idx + 1}. {p}</span>
            <span>
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="mx-1 px-2 py-1 bg-[#34495e] text-white"
                style={{ borderRadius: 0 }}
              >↑</button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === current.length - 1}
                className="mx-1 px-2 py-1 bg-[#34495e] text-white"
                style={{ borderRadius: 0 }}
              >↓</button>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-5 py-3 bg-gray-200 text-[#34495e] font-bold uppercase"
          style={{ borderRadius: 0 }}
        >Back</button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-[#34495e] text-white font-bold uppercase"
          style={{ borderRadius: 0 }}
        >Get Comparison</button>
      </div>
    </div>
  );
}
