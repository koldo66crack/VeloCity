// src/components/ListingCard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import { calculateWalkingDistance } from "../utils/distanceUtils";

import bed from "../assets/svg/bed-double-svgrepo-com.svg";
import bath from "../assets/svg/bath-svgrepo-com.svg";
import size from "../assets/svg/ruler-angular-svgrepo-com.svg";
import walking from "../assets/svg/walking-time-svgrepo-com.svg";
import gem from "../assets/svg/gem-stone-svgrepo-com.svg";

const COLUMBIA_UNIVERSITY_COORDS = { lat: 40.816151, lng: -73.943653 };

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

export default function ListingCard({
  listing,
  isSaved = false,
  isViewed = false,
  onSave,
  onUnsave,
  onGroupSave,
  onView,
  votes = [],
  onVote = () => {},
  nameMap = {},
  currentUserId,
  isGroupCard = false,
}) {
  const { user } = useAuth();
  const { openAuthModal } = useUI();

  const [saved, setSaved] = useState(isSaved);
  useEffect(() => setSaved(isSaved), [isSaved]);

  const [showSaveModal, setShowSaveModal] = useState(false);

  // Carousel state for photo gallery
  const images = listing.photos_url || [];
  const [currentImage, setCurrentImage] = useState(0);

  // Voting
  const upvoters = votes.filter((v) => v.vote > 0);
  const downvoters = votes.filter((v) => v.vote < 0);
  const currentUserVote =
    votes.find((v) => v.userId === currentUserId)?.vote || 0;

  const handleVoteClick = (voteValue) => {
    if (!user) return openAuthModal();
    if (currentUserVote === voteValue) return;
    onVote(listing.id, voteValue);
  };

  // Save/Unsave logic
  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openAuthModal();
      return;
    }

    if (saved) return;

    if (onGroupSave) {
      setShowSaveModal(true);
      return;
    }

    try {
      setSaved(true);
      await onSave(listing.id);
    } catch (err) {
      console.error("Error saving listing:", err);
      setSaved(false);
    }
  };

  const saveToGroup = async () => {
    setShowSaveModal(false);
    setSaved(true);
    try {
      await onGroupSave(listing.id);
    } catch (err) {
      setSaved(false);
      console.error("Error saving to group:", err);
    }
  };

  const saveToPersonal = async () => {
    setShowSaveModal(false);
    setSaved(true);
    try {
      await onSave(listing.id);
    } catch (err) {
      setSaved(false);
      console.error("Error saving personally:", err);
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
      await onUnsave(listing.id);
    } catch (err) {
      console.error("Error unsaving listing:", err);
      setSaved(true);
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

  const displayMarketplaces = Array.isArray(listing.marketplace)
    ? listing.marketplace.join(", ")
    : listing.marketplace || listing.listed_by || "unknown";

  // Carousel navigation handlers
  const goPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Studio display helper
  const bedDisplay =
    !listing.bedrooms || Number(listing.bedrooms) === 0
      ? "Studio"
      : `${listing.bedrooms} bed`;

  return (
    <div
      className={`relative bg-gray-700 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col w-full max-w-xl mx-auto min-h-[340px]`}
      style={{ minHeight: '340px' }}
    >
      <SaveChoiceModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onGroup={saveToGroup}
        onPersonal={saveToPersonal}
      />

      {/* --- IMAGE CAROUSEL --- */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-800 overflow-hidden flex items-center justify-center">
        {images.length > 0 ? (
          <img
            src={images[currentImage]}
            alt={listing.title}
            className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 ease-in-out"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500 text-center text-sm italic">
            Oops, we couldn't get the images for this listing.
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900 rounded-full px-2 py-1 shadow text-gray-200"
              onClick={goPrev}
            >
              ‹
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900 rounded-full px-2 py-1 shadow text-gray-200"
              onClick={goNext}
            >
              ›
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`inline-block w-2 h-2 rounded-full ${
                    idx === currentImage ? "bg-green-500" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </>
        )}
        {/* Gem Icon for Save/Unsave */}
        <button
          onClick={saved ? handleUnsave : handleSave}
          className="absolute top-3 right-3 p-1 rounded-full bg-gray-800/80 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 z-10"
          title={saved ? "Unsave" : "Save"}
          style={{ lineHeight: 0 }}
        >
          <img
            src={gem}
            alt="Save"
            className={`w-7 h-7 transition-all duration-200 ${
              saved ? "filter-none" : "grayscale opacity-60"
            } ${saved ? "drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]" : ""}`}
            style={{ filter: saved ? "drop-shadow(0 0 6px #22c55e)" : "grayscale(1) opacity(0.6)" }}
          />
        </button>
      </div>

      <Link
        to={`/listing/${listing.id}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleView}
        className="flex-1 flex flex-col justify-between p-5 sm:p-6 gap-2 cursor-pointer"
        style={{ minHeight: '180px' }}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-gray-200 truncate mb-1 hover:underline transition-all duration-150" title={listing.title}>
            {listing.title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-200">${price}</span>
            <span className="text-xs text-gray-200 font-medium">Per Bed: ${Number(listing.price_per_bed).toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-300 mt-2">
          <span className="flex items-center gap-1">
            <img src={bed} className="w-4 h-4" />
            {bedDisplay}
          </span>
          <span className="flex items-center gap-1">
            <img src={bath} className="w-4 h-4" /> {listing.bathrooms} bath
          </span>
          <span className="flex items-center gap-1">
            <img src={size} className="w-4 h-4" />
            {listing.size_sqft ? Number(listing.size_sqft).toFixed(2) : "—"} ft²
          </span>
          {distance !== null && (
            <span className="flex items-center gap-1">
              <img src={walking} className="w-4 h-4" />
              {distance} mi from Columbia
            </span>
          )}
        </div>
        <div className="text-[11px] text-gray-500 italic mt-2 text-right">
          Listed by {displayMarketplaces}
        </div>
      </Link>
      {/* ---- GROUP VOTING UI ---- */}
      {isGroupCard && (
        <div className="flex flex-col items-center py-2 border-t border-gray-800 bg-gray-950">
          <div className="flex gap-3 items-center mb-1">
            <button
              onClick={() => handleVoteClick(1)}
              className={`px-2 py-1 rounded ${
                currentUserVote === 1
                  ? "bg-green-600 text-gray-200"
                  : "bg-gray-800 hover:bg-green-900 text-green-400"
              }`}
            >
              👍 {upvoters.length}
            </button>
            <button
              onClick={() => handleVoteClick(-1)}
              className={`px-2 py-1 rounded ${
                currentUserVote === -1
                  ? "bg-red-600 text-gray-200"
                  : "bg-gray-800 hover:bg-red-900 text-red-400"
              }`}
            >
              👎 {downvoters.length}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-400">
            {upvoters.length > 0 && (
              <span>
                <span className="font-bold text-green-400">+ Voted:</span>{" "}
                {upvoters.map((v, i) => (
                  <span key={v.userId}>
                    {nameMap[v.userId] || v.user?.fullName || v.userId}
                    {i < upvoters.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            )}
            {downvoters.length > 0 && (
              <span>
                <span className="font-bold text-red-400">– Voted:</span>{" "}
                {downvoters.map((v, i) => (
                  <span key={v.userId}>
                    {nameMap[v.userId] || v.user?.fullName || v.userId}
                    {i < downvoters.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
