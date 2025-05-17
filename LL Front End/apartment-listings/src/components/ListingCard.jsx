import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import { calculateWalkingDistance } from "../utils/distanceUtils";

import bed from "../assets/svg/bed-double-svgrepo-com.svg";
import bath from "../assets/svg/bath-svgrepo-com.svg";
import size from "../assets/svg/ruler-angular-svgrepo-com.svg";
import walking from "../assets/svg/walking-time-svgrepo-com.svg";

const COLUMBIA_UNIVERSITY_COORDS = { lat: 40.816151, lng: -73.943653 };

export default function ListingCard({
  listing,
  isSaved = false,
  isViewed = false,
  onSave,
  onView,
}) {
  const { user } = useAuth();
  const { openAuthModal } = useUI();

  const [saved, setSaved] = useState(isSaved);
  useEffect(() => setSaved(isSaved), [isSaved]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openAuthModal();
      return;
    }

    if (saved) return;

    try {
      setSaved(true);
      onSave?.(listing.id);
    } catch (err) {
      console.error("Error saving listing:", err);
      setSaved(false);
    }
  };

  const handleView = () => {
    if (!isViewed) {
      onView?.(listing.id);
    }
  };

  const distance =
    listing.addr_lat && listing.addr_lon
      ? calculateWalkingDistance(
          COLUMBIA_UNIVERSITY_COORDS.lat,
          COLUMBIA_UNIVERSITY_COORDS.lng,
          listing.addr_lat,
          listing.addr_lon
        )
      : null;

  const price = listing.net_effective_price || listing.price;
  const pricePerBed = listing.bedrooms
    ? `$${Math.round(price / listing.bedrooms)} / bed`
    : "—";

  const displayMarketplaces = Array.isArray(listing.marketplace)
    ? listing.marketplace.join(", ")
    : listing.marketplace || listing.listed_by || "unknown";

  return (
    <div
      className={`relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border border-gray-200 ${
        isViewed ? "opacity-60" : ""
      }`}
    >
      {isViewed && (
        <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
          Viewed
        </span>
      )}
      
      <Link
        to={`/listing/${listing.id}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleView}
        className="block"
      >
        {listing.photo_url && (
          <div className="h-48 bg-gray-100 overflow-hidden">
            <img
              src={listing.photo_url}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x400?text=No+Image";
              }}
            />
          </div>
        )}

        <div className="p-4 space-y-2">
          <h3 className="text-base font-semibold text-blue-600 hover:underline">
            {listing.title}
          </h3>

          <div className="text-xl font-bold">${price}</div>
          <div className="text-sm text-green-700">{pricePerBed}</div>

          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <span className="flex items-center gap-1">
              <img src={bed} className="w-4 h-4" /> {listing.bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <img src={bath} className="w-4 h-4" /> {listing.bathrooms} bath
            </span>
            <span className="flex items-center gap-1">
              <img src={size} className="w-4 h-4" /> {listing.size_sqft || "—"} ft²
            </span>
          </div>

          {distance !== null && (
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <img src={walking} className="w-4 h-4" />
              {distance} mi from Columbia
            </p>
          )}

          {listing.LionScore && (
            <div className="text-sm font-medium px-3 py-2 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {listing.LionScore}
            </div>
          )}

          <p className="text-xs text-center text-gray-400 italic">
            Listed by {displayMarketplaces}
          </p>
        </div>
      </Link>

      <button
        onClick={handleSave}
        disabled={saved}
        className={`w-full py-2 text-sm font-semibold ${
          saved
            ? "bg-gray-300 cursor-not-allowed text-gray-700"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
        }`}
      >
        {saved ? "Saved ✔" : "Save this listing"}
      </button>
    </div>
  );
}
