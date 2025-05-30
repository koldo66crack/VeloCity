// src/components/SeasonalLaunchpadHero.jsx

import { useState, useEffect } from "react";

// Helper: get days until a specific date (configurable)
function getDaysUntil(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function SeasonalLaunchpadHero({
  user = null,         // { firstName: "Riddhi" } or null
  onGetStarted,        // function to handle click
  progress = 0,        // 0–100, or null if not started
  peakDate = "2024-06-15", // configurable prime rental date
  earlyBirdCount = null // (optional) number of early users
}) {
  const [daysLeft, setDaysLeft] = useState(getDaysUntil(peakDate));

  // Live countdown updates (midnight ticks)
  useEffect(() => {
    const interval = setInterval(() => {
      setDaysLeft(getDaysUntil(peakDate));
    }, 60 * 1000); // update every minute
    return () => clearInterval(interval);
  }, [peakDate]);

  // Choose CTA text based on progress
  let buttonText = "Get Started";
  if (progress > 0) buttonText = "Continue Your Apartment Hunt";
  if (progress === 100) buttonText = "See Your Progress";

  // Friendly badge if you want to show user count (optional)
  let badge = null;
  if (earlyBirdCount) {
    badge = (
      <div className="bg-yellow-100 text-yellow-700 text-xs rounded-full px-3 py-1 font-bold mb-2 inline-block">
        🦁 Early Bird #{earlyBirdCount}
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col items-center justify-center py-12 bg-gradient-to-b from-white to-yellow-50 rounded-2xl shadow-xl mb-8">
      {badge}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3 text-center">
        Welcome{user?.firstName ? `, ${user.firstName}` : ""}, Early Bird!
      </h1>
      <p className="text-lg text-gray-700 mb-5 text-center max-w-xl">
        You’re ahead of the game. <span className="font-bold text-yellow-600">VeloCity</span> is rolling out the red carpet for your NYC apartment hunt.
      </p>
      <div className="flex flex-col items-center mb-7">
        <div className="text-3xl font-bold text-yellow-700 flex items-baseline">
          <span className="animate-pulse">{daysLeft}</span>
          <span className="ml-2 text-xl font-normal text-gray-700">days until prime rental week!</span>
        </div>
      </div>
      <button
        className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl text-lg font-bold shadow-md transition-all duration-200"
        onClick={onGetStarted}
      >
        {buttonText}
      </button>
      <div className="mt-6 text-gray-500 text-sm text-center max-w-md">
        Starting early means more options, less stress, and exclusive perks. <br />
        Let’s make this your smoothest move yet!
      </div>
    </section>
  );
}
