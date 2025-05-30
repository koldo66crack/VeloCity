import title_logo from "../../assets/svg/title_logo.svg";

function calculateScores(listings, priorities) {
  // Assign weights: 5,4,3,2,1
  const weights = [5, 4, 3, 2, 1];
  return listings.map(listing => {
    let score = 0;
    const breakdown = {};
    priorities.forEach((priority, idx) => {
      let val = 0;
      // You can refine this logic further!
      switch (priority) {
        case "Budget":
          val = 2000 - listing.price; // lower price = higher val
          break;
        case "Proximity to Columbia":
          val = listing.neighborhood === "Morningside Heights" ? 100 : 70;
          break;
        case "Amenities":
          val = (listing.amenities ? listing.amenities.length : 0) * 10;
          break;
        case "Neighborhood":
          val = ["Morningside Heights", "Manhattanville"].includes(listing.neighborhood) ? 100 : 70;
          break;
        case "Number of Complaints":
          val = 20 - listing.complaints; // fewer complaints = higher score
          break;
      }
      breakdown[priority] = val * weights[idx];
      score += val * weights[idx];
    });
    return { ...listing, score, breakdown };
  }).sort((a, b) => b.score - a.score);
}

function CompareCard({ listing, highlight }) {
  return (
    <div
      className={`flex flex-col bg-white border-4 ${highlight ? "border-[#34495e]" : "border-gray-300"} p-5`}
      style={{
        borderRadius: 0,
        minWidth: 300,
        maxWidth: 370,
        margin: "1rem",
        boxShadow: highlight ? "0 4px 24px rgba(52,73,94,0.10)" : "none",
        opacity: highlight ? 1 : 0.8
      }}
    >
      <div className="font-bold text-[#34495e] text-lg mb-1">{listing.address}</div>
      <div className="text-black text-sm mb-1">${listing.price} · {listing.beds}BR {listing.baths}BA · {listing.neighborhood}</div>
      <div className="text-black text-xs mb-1">LionScore: <b>{listing.lionScore}</b> · Complaints: <b>{listing.complaints}</b></div>
      <div className="text-xs mb-1">{listing.amenities && listing.amenities.length ? listing.amenities.join(" · ") : ""}</div>
      <div className="mt-2">
        <div className="font-bold text-[#34495e] mb-1">Score: {listing.score}</div>
        <details className="text-xs">
          <summary className="cursor-pointer underline">See Score Breakdown</summary>
          <ul>
            {Object.entries(listing.breakdown).map(([k, v]) => (
              <li key={k}><b>{k}:</b> {v}</li>
            ))}
          </ul>
        </details>
      </div>
      {highlight && <div className="text-lg font-bold text-green-700 mt-2">🏆 Best Match</div>}
    </div>
  );
}

export default function CompareResults({ listings, priorities, onBack }) {
  const scored = calculateScores(listings, priorities);
  const winner = scored[0];
  const others = scored.slice(1);

  return (
    <div>
      <h2 className="text-xl font-bold text-[#34495e] mb-4 text-center">Results</h2>
      <div className="flex items-center justify-center">
        <CompareCard listing={winner} highlight />
        {others.length > 0 && <div className="mx-6 text-4xl text-[#34495e] font-bold"><img src={title_logo} alt="" /></div>}
        <div className="flex flex-col">
          {others.map((l, idx) => (
            <CompareCard key={l.id} listing={l} />
          ))}
        </div>
      </div>
      <div className="flex justify-start mt-6">
        <button
          onClick={onBack}
          className="px-5 py-3 bg-gray-200 text-[#34495e] font-bold uppercase"
          style={{ borderRadius: 0 }}
        >Back</button>
      </div>
    </div>
  );
}
