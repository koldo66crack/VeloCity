// src/components/GuideTabs/GuideTabs.jsx
import GuideChecklist from "./GuideChecklist";
import GuidePriorities from "./GuidePriorities"
import GuideLocations from "./GuideLocations";
import GuidePlatforms from "./GuidePlatforms";
import SeniorInsightsTab from "../SeniorInsights/SeniorInsightsTab";

export default function GuideTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b-2 border-[#34495e] mb-0">
      <button
        className={`px-8 py-4 uppercase font-bold text-lg ${activeTab === "guide"
            ? "bg-white text-[#34495e] border-t-2 border-x-2 border-[#34495e]"
            : "bg-[#34495e] text-white border-t-2 border-x-2 border-transparent"
          }`}
        style={{ borderRadius: 0, outline: "none" }}
        onClick={() => setActiveTab("guide")}
      >
        Guide
      </button>
      <button
        className={`px-8 py-4 uppercase font-bold text-lg ml-2 ${activeTab === "insights"
            ? "bg-white text-[#34495e] border-t-2 border-x-2 border-[#34495e]"
            : "bg-[#34495e] text-white border-t-2 border-x-2 border-transparent"
          }`}
        style={{ borderRadius: 0, outline: "none" }}
        onClick={() => setActiveTab("insights")}
      >
        Senior Insights
      </button>
    </div>
  );
}

// Modular: attach content components as static props
GuideTabs.GuideContent = function GuideContent() {
  return (
    <div className="flex flex-col gap-10">
      <GuideChecklist />
      <GuidePriorities />
      <GuideLocations />
      <GuidePlatforms />
    </div>
  );
};
GuideTabs.SeniorInsightsContent = function SeniorInsightsContent() {
  return (
    <SeniorInsightsTab />
  );
};
