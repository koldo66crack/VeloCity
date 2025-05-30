import { useState } from "react";
import CompareSelector from "../components/Compare/CompareSelector";
import ComparePriorityBar from "../components/Compare/ComparePriorityBar";
import CompareResults from "../components/Compare/CompareResults";

export default function ComparePage() {
  const [step, setStep] = useState(0);
  const [selectedListings, setSelectedListings] = useState([]); // array of listing ids
  const [priorities, setPriorities] = useState([
    "Budget",
    "Proximity to Columbia",
    "Amenities",
    "Neighborhood",
    "Number of Complaints"
  ]);
  const [selectedListingObjs, setSelectedListingObjs] = useState([]);

  // Pass listing objects along for scoring/results (for MVP simplicity)
  function handleNext(listingObjs) {
    setSelectedListingObjs(listingObjs);
    setStep(1);
  }

  return (
    <div className="min-h-screen bg-[#34495e] py-12 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white p-8" style={{ borderRadius: 0 }}>
        <h1 className="text-3xl text-[#34495e] font-extrabold mb-6 uppercase text-center">
          Compare Your Saved Apartments
        </h1>
        {step === 0 && (
          <CompareSelector
            selectedListings={selectedListings}
            setSelectedListings={setSelectedListings}
            onNext={listingObjs => handleNext(listingObjs)}
          />
        )}
        {step === 1 && (
          <ComparePriorityBar
            priorities={priorities}
            setPriorities={setPriorities}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <CompareResults
            listings={selectedListingObjs}
            priorities={priorities}
            onBack={() => setStep(1)}
          />
        )}
      </div>
    </div>
  );
}
