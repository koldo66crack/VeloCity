// src/components/ListingDetailPage.jsx
import { useParams } from "react-router-dom";
import listings from "../data/combined_listings_with_lionscore.json";
import { calculateWalkingDistance } from "../utils/distanceUtils";
import MapViewGoogle from "../components/MapViewGoogle";

import bed from "../assets/svg/bed-double-svgrepo-com.svg";
import bath from "../assets/svg/bath-svgrepo-com.svg";
import size from "../assets/svg/ruler-angular-svgrepo-com.svg";
import walking from "../assets/svg/walking-time-svgrepo-com.svg";
import titleLogoWhite from "../assets/svg/title_logo_white.svg";

import { useState } from "react";
import ListingAIChat from "../components/ListingAIChat";

const COLUMBIA_COORDS = { lat: 40.816151, lng: -73.943653 };

const lionScoreColors = {
  "🚨 Too Cheap to Be True": "text-red-600",
  "🔥 Steal Deal": "text-green-600",
  "✅ Reasonable": "text-yellow-600",
  "💸 Overpriced": "text-orange-600",
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const listing = listings.find((l) => String(l.id) === String(id));
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
    listing.bedrooms && listing.bedrooms > 0 ? price / listing.bedrooms : null;

  const fullAddress = `${listing.addr_street || ""} ${listing.addr_unit || ""
    }, ${listing.addr_city || ""}, ${listing.addr_state || ""} ${listing.addr_zip || ""
    }`;

  const complaints = listing.building_complaints || {};
  const complaintEntries = Object.entries(complaints).filter(
    ([_, count]) => count > 0
  );
  const hasVisibleComplaints = complaintEntries.some(([_, count]) => count > 5);

  const displayMarketplaces = Array.isArray(listing.marketplace)
    ? listing.marketplace.join(", ")
    : listing.marketplace || listing.listed_by || "unknown";

  // --- AMENITIES PARSING ---
  // Try to extract amenities from a field, else parse from description
  let amenities = [];
  if (listing.amenities && Array.isArray(listing.amenities)) {
    amenities = listing.amenities;
  } else if (listing.description) {
    // Simple amenities extraction from description (look for lines with '- ' or '* ')
    const matches = listing.description.match(/(?:[-*•]\s*)([A-Za-z0-9 ,\-/()]+)(?=\n|$)/g);
    if (matches) {
      amenities = matches.map((m) => m.replace(/^[-*•]\s*/, "").trim());
    } else {
      // Fallback: look for common amenity keywords
      const amenityKeywords = [
        "Dishwasher", "Hardwood Floors", "Elevator", "Laundry", "Microwave", "Stainless Steel", "Doorman", "Gym", "Balcony", "Fireplace", "Closet", "Washer", "Dryer", "Central Air", "Parking", "Pet Friendly", "Roof Deck", "Virtual Doorman", "Storage", "Garden", "Terrace", "Furnished"
      ];
      const desc = listing.description.toLowerCase();
      amenities = amenityKeywords.filter((k) => desc.includes(k.toLowerCase()));
    }
  }

  return (
    <div className="mx-auto mt-12 px-4 py-12 md:pt-16 bg-gray-900">
      {/* AI Chat Component */}
      {/* <div className="mb-8">
        <ListingAIChat listing={listing} />
      </div> */}

      <div className="max-w-5xl mx-auto flex flex-col items-center md:flex-row gap-8 md:gap-12">
        {/* LEFT: Main Info */}
        <div className="md:w-1/2 space-y-6">
          {/* --- IMAGE GALLERY --- */}
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-gray-700 flex items-center justify-center mb-4">
            {Array.isArray(listing.photos_url) && listing.photos_url.length > 0 ? (
              <>
                <img
                  src={listing.photos_url[imageIndex]}
                  alt={`Image ${imageIndex + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300"
                />
                {listing.photos_url.length > 1 && (
                  <>
                    {/* Previous */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImageIndex((prev) =>
                          prev === 0 ? listing.photos_url.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-gray-700 p-2 rounded-full shadow"
                    >
                      ⟨
                    </button>
                    {/* Next */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImageIndex((prev) =>
                          prev === listing.photos_url.length - 1 ? 0 : prev + 1
                        );
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-gray-700 p-2 rounded-full shadow"
                    >
                      ⟩
                    </button>
                  </>
                )}
                {/* Indicator Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {listing.photos_url.map((_, idx) => (
                    <span
                      key={idx}
                      className={`inline-block w-2 h-2 rounded-full ${idx === imageIndex ? "bg-green-400" : "bg-gray-500"
                        }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <img
                src={
                  listing.photo_url ||
                  listing.medium_image_uri ||
                  "https://via.placeholder.com/800x400?text=No+Image"
                }
                alt="No photos"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {/* --- TITLE & PRICE --- */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">
              {listing.title}
            </h1>
            <span className="text-xl md:text-2xl font-bold text-green-400">
              ${Number(price).toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
          </div>
          {/* --- BED/BATH/SQFT/ETC --- */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base md:text-lg font-medium text-gray-300 border-t border-gray-700 pt-4 mt-2">
            <span className="flex items-center gap-2">
              <img src={bed} alt="Beds" className="w-5 h-5" />
              {listing.bedrooms === 0 ? "Studio" : listing.bedrooms !== undefined ? `${listing.bedrooms} bed` : "—"}
            </span>
            <span className="flex items-center gap-2">
              <img src={bath} alt="Baths" className="w-5 h-5" />
              {listing.bathrooms !== undefined ? listing.bathrooms : "—"} bath
            </span>
            <span className="flex items-center gap-2">
              <img src={size} alt="Size" className="w-5 h-5" />
              {listing.size_sqft ? Number(listing.size_sqft).toFixed(0) : "—"} ft²
            </span>
            <span className="flex items-center gap-2">
              <img src={walking} alt="Walking" className="w-5 h-5" />
              {distance} mi to Columbia
            </span>
          </div>
          {/* --- AMENITIES --- */}
          {amenities.length > 0 && (
            <div className="bg-gray-700 p-5 rounded-xl shadow-md border border-gray-700 mt-4">
              <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-1 mb-2 flex items-center gap-2">
                Amenities
              </h2>
              <ul className="space-y-2 mt-2">
                {amenities.map((am, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-200 text-base">
                    <img src={titleLogoWhite} alt="Amenity" className="w-5 h-5 inline-block" />
                    <span>{am}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* --- DESCRIPTION --- */}
          <div className="bg-gray-700 p-5 rounded-xl shadow-md border border-gray-700 mt-4">
            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-1 mb-2">Description</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              {listing.description || "No description provided."}
            </p>
          </div>
        </div>
        {/* RIGHT: Map & Source */}
        <div className="md:w-1/2 space-y-4">
          <div className="bg-gray-700 p-4 rounded-xl shadow-md border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-3">Map View</h2>
            <div className="w-full h-80 rounded-md overflow-hidden">
              <MapViewGoogle listings={[listing]} />
            </div>
          </div>
          <a
            href={listing.source_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full shadow-sm mt-2"
          >
            View Original Listing ↗
          </a>
          <p className="text-xs text-center text-gray-400 italic mt-2">
            Listed by {displayMarketplaces}
          </p>
          {/* --- BUILDING COMPLAINTS --- */}
          <div className="bg-gray-700 p-5 rounded-xl shadow-md border border-gray-700 mt-4">
            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-1 mb-2">Building Complaints</h2>
            {hasVisibleComplaints ? (
              <ul className="list-disc pl-5 text-base text-gray-300">
                {complaintEntries.filter(([_, count]) => count > 5).map(([type, count]) => (
                  <li key={type}>
                    <strong>{type}</strong>: {count} reports
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-400 text-base font-semibold">
                ✨ Squeaky clean! No notable complaints here. ✨
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
