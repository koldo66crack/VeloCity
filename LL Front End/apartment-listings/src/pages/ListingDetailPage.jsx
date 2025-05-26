// src/components/ListingDetailPage.jsx
import { useParams } from "react-router-dom";
import listings from "../data/combined_listings_with_lionscore.json";
import { calculateWalkingDistance } from "../utils/distanceUtils";

import MapViewGoogle from "../components/MapViewGoogle";

import bed from "../assets/svg/bed-double-svgrepo-com.svg";
import bath from "../assets/svg/bath-svgrepo-com.svg";
import size from "../assets/svg/ruler-angular-svgrepo-com.svg";
import walking from "../assets/svg/walking-time-svgrepo-com.svg";

import { useState } from "react";

const COLUMBIA_COORDS = { lat: 40.816151, lng: -73.943653 };

const lionScoreColors = {
  "🚨 Too Cheap to Be True": "text-red-600",
  "🔥 Steal Deal": "text-green-600",
  "✅ Reasonable": "text-yellow-600",
  "💸 Overpriced": "text-orange-600",
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const listing = listings[parseInt(id)];
  const [imageIndex, setImageIndex] = useState(0);

  if (!listing)
    return <div className="p-8 text-center">Listing not found.</div>;

  const distance = calculateWalkingDistance(
    COLUMBIA_COORDS.lat,
    COLUMBIA_COORDS.lng,
    listing.addr_lat,
    listing.addr_lon
  );

  const price = listing.net_effective_price || listing.price;
  const pricePerBed =
    listing.bedrooms && listing.bedrooms > 0
      ? `$${Math.round(price / listing.bedrooms)} / bed`
      : "Bed info unavailable";

  const fullAddress = `${listing.addr_street || ""} ${
    listing.addr_unit || ""
  }, ${listing.addr_city || ""}, ${listing.addr_state || ""} ${
    listing.addr_zip || ""
  }`;
  const complaints = listing.building_complaints || {};
  const complaintEntries = Object.entries(complaints).filter(
    ([_, count]) => count > 0
  );
  const hasVisibleComplaints = complaintEntries.some(([_, count]) => count > 5);

  const displayMarketplaces = Array.isArray(listing.marketplace)
    ? listing.marketplace.join(", ")
    : listing.marketplace || listing.listed_by || "unknown";

  return (
    <div className="max-w-7xl mx-auto pt-36 px-4 py-4">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
          <div className="text-xl font-semibold text-gray-700">
            Price: <span className="text-2xl font-bold text-[#34495e]">${price}</span>
          </div>
          <div className="text-sm text-green-700 mb-4">{pricePerBed}</div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-lg font-medium text-gray-800 border-t pt-4 mt-2">
            <span className="flex items-center gap-2">
              <img src={bed} alt="Beds" className="w-5 h-5" /> {listing.bedrooms || "—"} bed
            </span>
            <span className="flex items-center gap-2">
              <img src={bath} alt="Baths" className="w-5 h-5" /> {listing.bathrooms || "—"} bath
            </span>
            <span className="flex items-center gap-2">
              <img src={size} alt="Size" className="w-5 h-5" /> {listing.size_sqft || "—"} ft²
            </span>
            <span className="flex items-center gap-2">
              <img src={walking} alt="Walking" className="w-5 h-5" /> {distance} mi to Columbia
            </span>
          </div>

          {listing.LionScore && (
            <div className="mt-4">
              <span className="block text-sm font-medium text-gray-500 mb-1">VeloScore™</span>
              <div className={`text-lg font-bold ${lionScoreColors[listing.LionScore]}`}>
                {listing.LionScore}
              </div>
            </div>
          )}

          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <img
              src={listing.photo_url || listing.medium_image_uri}
              alt={`Image ${imageIndex + 1}`}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/800x400?text=No+Image")
              }
              className="w-full h-full object-cover"
            />
            <button
              onClick={() =>
                setImageIndex((prev) => (prev === 0 ? 4 : prev - 1))
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            >
              ⟨
            </button>
            <button
              onClick={() =>
                setImageIndex((prev) => (prev === 4 ? 0 : prev + 1))
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            >
              ⟩
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 space-y-2">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-1">Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {listing.description || "No description provided."}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 space-y-2">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-1">Building Complaints</h2>
            {hasVisibleComplaints ? (
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {complaintEntries
                  .filter(([_, count]) => count > 5)
                  .map(([type, count]) => (
                    <li key={type}>
                      <strong>{type}</strong>: {count} reports
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-yellow-500 text-sm font-semibold">
                ✨ Squeaky clean! No notable complaints here. ✨
              </p>
            )}
          </div>
        </div>

        <div className="md:w-1/2 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">Map View</h2>
            <div className="w-full h-80 rounded-md overflow-hidden">
              <MapViewGoogle listings={[listing]} />
            </div>
          </div>

          <a
            href={listing.source_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center bg-[#34495e] hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full shadow-sm"
          >
            View Original Listing ↗
          </a>
          <p className="text-xs text-center text-gray-400 italic">
            Listed by {displayMarketplaces}
          </p>
        </div>
      </div>
    </div>
  );
}
