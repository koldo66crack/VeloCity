import { useState } from "react";

export default function RentalTermFlipCard({ term, definition }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`relative w-64 h-36 cursor-pointer`}
      style={{
        perspective: "1000px",
        display: "inline-block",
        margin: "1rem",
      }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className={`absolute inset-0 transition-transform duration-500`}
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-[#34495e] flex items-center justify-center text-white text-2xl font-extrabold uppercase border-2 border-[#85929e]"
          style={{
            backfaceVisibility: "hidden",
            borderRadius: 0,
            boxShadow: "0 4px 24px rgba(30,41,59,0.07)",
          }}
        >
          {term}
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 bg-white flex items-center justify-center text-black text-base font-bold px-4 text-center border-2 border-[#34495e]"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            borderRadius: 0,
          }}
        >
          {definition}
        </div>
      </div>
    </div>
  );
}
