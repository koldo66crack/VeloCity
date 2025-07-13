// src/components/ListingDetailPage.jsx
import { useParams } from "react-router-dom";
import listings from "../data/combined_listings_with_lionscore.json";
import { calculateWalkingDistance } from "../utils/distanceUtils";
import MapViewGoogle from "../components/MapViewGoogle";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import { useState, useEffect } from "react";

import bed from "../assets/svg/bed-double-svgrepo-com.svg";
import bath from "../assets/svg/bath-svgrepo-com.svg";
import size from "../assets/svg/ruler-angular-svgrepo-com.svg";
import walking from "../assets/svg/walking-time-svgrepo-com.svg";
import titleLogoWhite from "../assets/svg/title_logo_white.svg";
import gem from "../assets/svg/gem-stone-svgrepo-com.svg";
import doubleArrowLeft from "../assets/svg/double-arrow-left.svg";
import doubleArrowRight from "../assets/svg/double-arrow-right.svg";

import ListingAIChat from "../components/ListingAIChat";

const COLUMBIA_COORDS = { lat: 40.816151, lng: -73.943653 };
const BASE_URL = import.meta.env.VITE_API_URL;

const lionScoreColors = {
  "🚨 Too Cheap to Be True": "text-red-600",
  "🔥 Steal Deal": "text-green-600",
  "✅ Reasonable": "text-yellow-600",
  "💸 Overpriced": "text-orange-600",
};

function SaveChoiceModal({ open, onClose, onGroup, onPersonal }) {
  if (!open) return null;
  return (
    <div className="m-2 fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 p-6 shadow-2xl w-[340px] rounded-lg border border-gray-700">
        <h3 className="text-lg font-bold mb-2 text-gray-200">Save Listing</h3>
        <p className="mb-6 text-gray-300">
          Where do you want to save this listing?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onGroup}
            className="bg-green-600 hover:bg-green-700 text-gray-200 px-4 py-2 font-semibold rounded"
          >
            Save to <span className="font-bold">Group Dashboard</span>
          </button>
          <button
            onClick={onPersonal}
            className="bg-gray-800 border border-green-600 text-green-400 hover:bg-gray-700 px-4 py-2 font-semibold rounded"
          >
            Save to <span className="font-bold">My Dashboard</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 px-2 py-1 mt-1 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { openAuthModal } = useUI();
  const listing = listings.find((l) => String(l.id) === String(id));
  const [imageIndex, setImageIndex] = useState(0);
  
  // Save state management
  const [saved, setSaved] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [group, setGroup] = useState(null);
  const [groupLoaded, setGroupLoaded] = useState(false);

  // Check if listing is saved and load group data
  useEffect(() => {
    if (!user?.id || !listing) return;
    
    const checkSavedStatus = async () => {
      try {
        // Check if saved personally
        const savedRes = await fetch(`${BASE_URL}/api/saved/${user.id}`);
        if (savedRes.ok) {
          const savedRows = await savedRes.json();
          const isPersonallySaved = savedRows.some(r => String(r.listingId) === String(listing.id));
          
          // Check group membership and group saves
          const grpRes = await fetch(`${BASE_URL}/api/group/my?userId=${user.id}`);
          if (grpRes.ok) {
            const { group: grp } = await grpRes.json();
            setGroup(grp);
            
            if (grp) {
              const gsRes = await fetch(`${BASE_URL}/api/group/saved/${grp.id}`);
              if (gsRes.ok) {
                const groupSavedRows = await gsRes.json();
                const isGroupSaved = groupSavedRows.some(r => String(r.listingId) === String(listing.id));
                setSaved(isPersonallySaved || isGroupSaved);
              } else {
                setSaved(isPersonallySaved);
              }
            } else {
              setSaved(isPersonallySaved);
            }
          } else {
            setSaved(isPersonallySaved);
          }
        } else {
          console.warn(`Failed to fetch saved status: ${savedRes.status}`);
          setSaved(false);
        }
        setGroupLoaded(true);
      } catch (error) {
        console.error("Error checking save status:", error);
        setSaved(false);
        setGroupLoaded(true);
      }
    };
    
    checkSavedStatus();
  }, [user?.id, listing]);

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

  // Save/Unsave handlers
  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openAuthModal();
      return;
    }

    if (saved) return;

    if (group) {
      setShowSaveModal(true);
      return;
    }

    try {
      setSaved(true);
      await saveToPersonal();
    } catch (err) {
      console.error("Error saving listing:", err);
      setSaved(false);
    }
  };

  const saveToGroup = async () => {
    setShowSaveModal(false);
    setSaved(true);
    try {
      const res = await fetch(`${BASE_URL}/api/group/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          groupId: group.id,
          listingId: String(listing.id),
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to save to group");
      }
    } catch (err) {
      setSaved(false);
      console.error("Error saving to group:", err);
    }
  };

  const saveToPersonal = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, listingId: String(listing.id) }),
      });
      if (!res.ok) {
        throw new Error("Failed to save personally");
      }
    } catch (err) {
      console.error("Error saving personally:", err);
      throw err;
    }
  };

  const handleUnsave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      setSaved(false);
      // Try to unsave from both personal and group
      await Promise.allSettled([
        fetch(`${BASE_URL}/api/saved/${user.id}/${listing.id}`, { method: "DELETE" }),
        group ? fetch(`${BASE_URL}/api/group/saved/${group.id}/${listing.id}`, { method: "DELETE" }) : Promise.resolve()
      ]);
    } catch (err) {
      console.error("Error unsaving listing:", err);
      setSaved(true);
    }
  };

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

  // Carousel controls: always visible on mobile, on hover for desktop
  const [isHovered, setIsHovered] = useState(false);
  const showCarouselControls = listing.photos_url && listing.photos_url.length > 1 && (isHovered || window.innerWidth < 768);

  // Helper for details bar
  const details = [
    { value: `$${Number(price).toLocaleString()}`, label: "Price" },
    { value: listing.bedrooms === 0 ? "Studio" : listing.bedrooms !== undefined ? `${listing.bedrooms}` : "—", label: "Beds" },
    { value: listing.bathrooms !== undefined ? listing.bathrooms : "—", label: "Bath" },
    { value: listing.size_sqft ? Number(listing.size_sqft).toFixed(0) : "—", label: "Sq. Ft." }
  ];

  return (
    <div className="mx-auto mt-12 px-4 py-12 md:pt-16 bg-gray-900">
      <SaveChoiceModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onGroup={saveToGroup}
        onPersonal={saveToPersonal}
      />

      {/* --- TOP BAR --- */}
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2 bg-gray-800 rounded-sm px-4 py-3 mb-6 shadow">
        {/* Address/Title */}
        <div className="flex-1 min-w-0">
          <div className="text-gray-100 text-base truncate">{listing.title}</div>
          <div className="text-green-400 text-sm truncate">{listing.addr_street}</div>
          <div className="text-gray-400 text-xs">{listing.orig_area_name || listing.neighborhood}</div>
        </div>
        {/* Details */}
        <div className="flex items-end gap-4 flex-shrink-0">
          {details.map((d, i) => (
            <div key={i} className="flex flex-col items-center px-2">
              <span className="text-gray-100 text-sm">{d.value}</span>
              <span className="text-gray-500 text-xs">{d.label}</span>
            </div>
          ))}
        </div>
        {/* Save & Share */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={saved ? handleUnsave : handleSave}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            title={saved ? "Unsave" : "Save"}
            style={{ lineHeight: 0 }}
          >
            <img
              src={gem}
              alt="Save"
              className={`w-6 h-6 transition-all duration-200 ${
                saved ? "filter-none" : "grayscale opacity-60"
              }`}
              style={{ filter: saved ? "drop-shadow(0 0 6px #22c55e)" : "grayscale(1) opacity(0.6)" }}
            />
          </button>
          {/* Share placeholder */}
          <button className="p-2 rounded bg-gray-700 text-gray-300 text-xs cursor-not-allowed opacity-60" disabled>
            Share
          </button>
        </div>
      </div>

      {/* AI Chat Component */}
      {/* <div className="mb-8">
        <ListingAIChat listing={listing} />
      </div> */}

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
        {/* LEFT: Main Info */}
        <div className="md:w-2/3 space-y-6">
          {/* --- IMAGE GALLERY --- */}
          <div
            className="relative w-full aspect-[16/10] rounded-sm overflow-hidden shadow-2xl bg-gray-700 flex flex-col items-center justify-center mb-4"
          >
            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-2 z-20">
              <span className="bg-black/80 text-white px-3 py-1 rounded-md text-xs">
                Listed by {displayMarketplaces}
              </span>
              {listing.no_fee && (
                <span className="bg-green-600 text-white px-2 py-1 rounded-md text-xs">
                  No Fee
                </span>
              )}
            </div>
            {/* Main Image */}
            {Array.isArray(listing.photos_url) && listing.photos_url.length > 0 ? (
              <>
                <img
                  src={listing.photos_url[imageIndex]}
                  alt={`Image ${imageIndex + 1}`}
                  className="h-full w-full object-contain transition-transform duration-300"
                />
                {/* Left Arrow */}
                {listing.photos_url.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImageIndex((prev) =>
                        prev === 0 ? listing.photos_url.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full p-2 shadow flex items-center justify-center z-20"
                  >
                    <img src={doubleArrowLeft} alt="Previous" className="w-6 h-6" />
                  </button>
                )}
                {/* Right Arrow */}
                {listing.photos_url.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImageIndex((prev) =>
                        prev === listing.photos_url.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full p-2 shadow flex items-center justify-center z-20"
                  >
                    <img src={doubleArrowRight} alt="Next" className="w-6 h-6" />
                  </button>
                )}
                {/* Thumbnails */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1 px-2 py-2 bg-black/60 overflow-x-auto z-20">
                  {listing.photos_url.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImageIndex(idx);
                      }}
                      className={`border-2 rounded-md overflow-hidden transition-all duration-150 ${
                        idx === imageIndex
                          ? "border-green-500"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ minWidth: 48, minHeight: 36, maxWidth: 64, maxHeight: 48 }}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="object-cover w-full h-full"
                        style={{ aspectRatio: "4/3" }}
                      />
                    </button>
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
          {/* <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">
              {listing.title}
            </h1>
            <span className="text-xl md:text-2xl font-bold text-green-400">
              ${Number(price).toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
          </div> */}
          {/* --- BED/BATH/SQFT/ETC --- */}
          {/* <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base md:text-lg font-medium text-gray-300 border-t border-gray-700 pt-4 mt-2">
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
          </div> */}
          {/* --- AMENITIES --- */}
          {amenities.length > 0 && (
            <div className="bg-gray-700 p-5 rounded-sm shadow-md border border-gray-700 mt-4">
              <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-1 mb-2 flex items-center gap-2">
                Amenities
              </h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                {amenities.map((am, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-200 text-sm">
                    <img src={titleLogoWhite} alt="Amenity" className="w-5 h-5 inline-block" />
                    <span>{am}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* --- DESCRIPTION --- */}
          <div className="bg-gray-700 p-5 rounded-sm shadow-md border border-gray-700 mt-4">
            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-1 mb-2">Description</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              {listing.description || "No description provided."}
            </p>
          </div>
        </div>
        {/* RIGHT: Map & Source */}
        <div className="md:w-1/2 space-y-4">
          <div className="bg-gray-700 p-4 rounded-sm shadow-md border border-gray-700">
            <h2 className="text-sm font-semibold text-white mb-3">Map View</h2>
            <div className="w-full h-80 rounded-md overflow-hidden">
              <MapViewGoogle
                listings={[listing]}
                mapOptions={{ zoom: 13 }} // Lower value for more zoomed out
              />
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
          {/* --- BUILDING COMPLAINTS --- */}
          <div className="bg-gray-700 p-5 rounded-sm shadow-md border border-gray-700 mt-4">
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
                Squeaky clean! No notable complaints here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
