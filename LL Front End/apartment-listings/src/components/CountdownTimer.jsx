import { useState, useEffect } from "react";

// Set your deadline here (midnight on July 15, 2024)
const DEADLINE = new Date(2024, 6, 15, 0, 0, 0); // Months are zero-based in JS

function getTimeLeft() {
  const now = new Date();
  const total = DEADLINE - now;
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return {
    total,
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
  };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row gap-4 items-center justify-center">
      {[
        { label: "DAYS", value: timeLeft.days },
        { label: "HOURS", value: timeLeft.hours },
        { label: "MINUTES", value: timeLeft.minutes },
        { label: "SECONDS", value: timeLeft.seconds },
      ].map((t, i) => (
        <div
          key={t.label}
          className="flex flex-col items-center px-5 py-2 bg-[#34495e] border-2 border-[#85929e]"
          style={{ minWidth: 80, borderRadius: 0 }}
        >
          <span
            className="font-mono text-4xl font-extrabold text-white"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {String(t.value).padStart(2, "0")}
          </span>
          <span className="uppercase text-xs tracking-widest text-[#85929e] mt-1">
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}
