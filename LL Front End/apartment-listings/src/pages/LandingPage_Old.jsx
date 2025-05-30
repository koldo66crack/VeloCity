import { useEffect, useState } from "react";
import CountdownTimer from "../components/CountdownTimer";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-800 relative">
      <div className="w-full h-4 bg-[#85929e] absolute top-0 left-0" />
      <div
        className="w-full max-w-xl flex flex-col items-center bg-[#5d6d7e] border-l-8 border-r-8 border-[#85929e] px-0 py-0 mt-24 mb-12 shadow-2xl"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.8)", borderRadius: "0" }}
      >
        <div className="w-full bg-[#34495e] px-10 py-7 border-b-4 border-[#85929e]">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-white text-left">
            THE NYC RENTAL RUSH IS COMING
          </h1>
          <h2 className="text-lg sm:text-xl mt-2 text-[#85929e] font-semibold uppercase tracking-wider text-left">
            Don’t Get Left Behind.
          </h2>
        </div>
        {/* NEW COUNTDOWN HERE */}
        <div className="w-full flex flex-col items-center px-10 py-8 bg-[#5d6d7e]">
          <CountdownTimer />
          <div className="uppercase text-base text-white font-semibold tracking-wide mt-6">
            Until Prime Renting Season:{" "}
            <span className="text-[#85929e] font-bold">July 15</span>
          </div>
        </div>
        <div className="w-full bg-[#85929e] border-t-4 border-[#34495e] px-10 py-7 flex flex-col items-center gap-2">
          <button
            onClick={() => navigate("/early-bird")}
            className="w-full py-4 bg-[#34495e] hover:bg-[#232f3e] text-white font-extrabold text-lg uppercase tracking-wide"
            style={{ borderRadius: 0, letterSpacing: "0.09em" }}
          >
            Unlock Early Bird Advantage
          </button>
          <button
            onClick={() => navigate("/compare")}
            className="w-full py-3 bg-[#85929e] hover:bg-[#5d6d7e] text-[#34495e] font-bold text-lg uppercase tracking-wide mt-4"
            style={{ borderRadius: 0, letterSpacing: "0.09em" }}
          >
            Try Comparison Playground
          </button>
          <button
            onClick={() => navigate("/senior-blueprint")}
            className="w-full py-3 bg-[#85929e] hover:bg-[#5d6d7e] text-[#34495e] font-bold text-lg uppercase tracking-wide mt-4"
            style={{ borderRadius: 0, letterSpacing: "0.09em" }}
          >
            Get Senior Insights
          </button>
          <button
            onClick={() => navigate("/home")}
            className="w-full py-4 bg-[#85929e] hover:bg-[#5d6d7e] text-[#34495e] font-bold text-lg uppercase tracking-wide"
            style={{ borderRadius: 0, letterSpacing: "0.09em" }}
          >
            Search Rentals Now
          </button>
          <div className="w-full text-center text-[#34495e] text-base uppercase font-medium mt-6 tracking-wide">
            <span className="inline-block border-b-2 border-[#34495e] pb-1">
              Market insights • Senior tips • VIP deals
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-4 bg-[#85929e] absolute bottom-0 left-0" />
    </div>
  );
}
