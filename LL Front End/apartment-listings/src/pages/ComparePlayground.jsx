// src/pages/ComparePlayground.jsx
import { useState } from "react";

const SAMPLE_LISTINGS = [
  {
    title: "Senior’s 2023 Apt",
    lionScore: 82,
    price: 1450,
    beds: 3,
    baths: 1.5,
    size: 950,
    distance: "7 min walk",
    fees: 0,
    notes: "Laundry, elevator, no broker fee",
  }
];

export default function ComparePlayground() {
  const [listings, setListings] = useState(SAMPLE_LISTINGS);

  function handleAdd() {
    setListings(listings => [
      ...listings,
      {
        title: "",
        lionScore: "",
        price: "",
        beds: "",
        baths: "",
        size: "",
        distance: "",
        fees: "",
        notes: "",
      }
    ]);
  }

  function handleChange(idx, key, value) {
    setListings(listings =>
      listings.map((l, i) =>
        i === idx ? { ...l, [key]: value } : l
      )
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#34495e] flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-5xl border border-[#85929e] bg-[#5d6d7e] p-0" style={{ borderRadius: 0 }}>
        <h2 className="text-2xl text-white font-extrabold uppercase tracking-widest text-center my-8">
          Comparison Playground
        </h2>
        <div className="flex justify-between mb-4">
          {listings.length < 3 && (
            <button
              className="py-2 px-5 bg-[#85929e] hover:bg-[#34495e] text-[#34495e] hover:text-[#85929e] font-bold uppercase tracking-wide"
              style={{ borderRadius: 0 }}
              onClick={handleAdd}
            >
              + Add Listing
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => {
            const l = listings[idx] || {};
            return (
              <div key={idx} className="bg-[#34495e] border border-[#85929e] p-6 text-white flex flex-col gap-2" style={{ borderRadius: 0, minHeight: 370 }}>
                <input
                  type="text"
                  className="bg-[#5d6d7e] border border-[#85929e] px-2 py-1 text-white mb-2 uppercase font-bold"
                  style={{ borderRadius: 0 }}
                  placeholder={idx === 0 ? "Senior's 2023 Apt" : "Your Listing"}
                  value={l.title || ""}
                  onChange={e => handleChange(idx, "title", e.target.value)}
                  disabled={idx === 0} // Senior sample locked for MVP
                />
                <label>LionScore</label>
                <input
                  type="number"
                  className="bg-[#5d6d7e] border border-[#85929e] px-2 py-1 text-white"
                  style={{ borderRadius: 0 }}
                  value={l.lionScore || ""}
                  onChange={e => handleChange(idx, "lionScore", e.target.value)}
                />
                <label>Price ($/mo)</label>
                <input
                  type="number"
                  className="bg-[#5d6d7e] border border-[#85929e] px-2 py-1 text-white"
                  style={{ borderRadius: 0 }}
                  value={l.price || ""}
                  onChange={e => handleChange(idx, "price", e.target.value)}
                />
                <label>Bedrooms</label>
                <input
                  type="number"
                  className="bg-[#5d6d7e] border border-[#85929e] px-2 py-1 text-white"
                  style={{ borderRadius: 0 }}
                  value={l.beds || ""}
                  onChange={e => handleChange(idx, "beds", e.target.value)}
                />
                <label>Bathrooms</label>
                <input
                  type="number"
                  className="bg-[#5d6d7e] border border-[#85929e] px-2 py-1 text-white"
                  style={{ borderRadius: 0 }}
                  value={l.baths || ""}
                  onChange={e => handleChange(idx, "baths", e.target.value)}
                />
                <label>Size (sqft)</label>
                <input
                  type="number"
                  className="bg-[#5d6d7e] border border-[#85929e] px-2 py-1 text-white"
                  style={{ borderRadius: 0 }}
                  value={l.size || ""}
                  onChange={e => handleChange(idx, "size", e.target.value)}
                />
                <label>Distance to Campus</label>
                <input
                  type="text"
                  className="bg-[#5d6d7e] border border-[#85929e] px-2 py-1 text-white"
                  style={{ borderRadius: 0 }}
                  value={l.distance || ""}
                  onChange={e => handleChange(idx, "distance", e.target.value)}
                />
                <label>Fees (Broker, Guarantor, etc)</label>
                <input
                  type="number"
                  className="bg-[#5d6d7e] border border-[#85929e] px-2 py-1 text-white"
                  style={{ borderRadius: 0 }}
                  value={l.fees || ""}
                  onChange={e => handleChange(idx, "fees", e.target.value)}
                />
                <label>Notes</label>
                <input
                  type="text"
                  className="bg-[#5d6d7e] border border-[#85929e] px-2 py-1 text-white"
                  style={{ borderRadius: 0 }}
                  value={l.notes || ""}
                  onChange={e => handleChange(idx, "notes", e.target.value)}
                />
              </div>
            );
          })}
        </div>
        {/* Simple Comparison Row */}
        <div className="text-center mt-8 text-lg text-[#85929e] font-bold">
          {listings[1] && listings[0] && (
            <>
              Your LionScore vs. Senior: <span className={parseInt(listings[1].lionScore, 10) > listings[0].lionScore ? "text-green-400" : "text-red-400"}>
                {parseInt(listings[1].lionScore, 10) - listings[0].lionScore > 0
                  ? `+${parseInt(listings[1].lionScore, 10) - listings[0].lionScore}`
                  : `${parseInt(listings[1].lionScore, 10) - listings[0].lionScore}`}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
