// src/pages/GuidePage.jsx
import { useState } from "react";
import GuideTabs from "../components/GuideTabs/GuideTabs";

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("guide");

  return (
    <div className="min-h-screen bg-[#34495e] p-8">
      <div className="mx-auto pt-10">
        <GuideTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="bg-white px-8 py-10" style={{ borderRadius: 0, minHeight: "500px" }}>
          {activeTab === "guide" ? (
            <GuideTabs.GuideContent />
          ) : (
            <GuideTabs.SeniorInsightsContent />
          )}
        </div>
      </div>
    </div>
  );
}
