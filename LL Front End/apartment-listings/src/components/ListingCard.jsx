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
import doubleArrowLeft from "../assets/svg/double-arrow-left.svg";
import doubleArrowRight from "../assets/svg/double-arrow-right.svg";

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

  // Responsive: show carousel controls always on mobile, on hover for desktop
  const [isHovered, setIsHovered] = useState(false);
  const showCarouselControls = images.length > 1 && (isHovered || window.innerWidth < 768);

  return (
    <div
      className="relative bg-gray-700 rounded-sm shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col w-full max-w-xl mx-auto min-h-[320px]"
      style={{ minHeight: '320px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SaveChoiceModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onGroup={saveToGroup}
        onPersonal={saveToPersonal}
      />

      {/* --- IMAGE CAROUSEL --- */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-800 overflow-hidden flex items-center justify-center rounded-t-sm">
        {/* Listed By label */}
        <span className="absolute top-2 left-2 bg-black/80 text-white px-3 py-1 rounded-md text-xs z-20">
          Listed by {displayMarketplaces}
        </span>
        {/* Image index (bottom left) */}
        {images.length > 1 && (
          <span
            className={`
              absolute bottom-2 left-2 px-2 py-1 text-xs text-white bg-black/70
              z-20
              ${showCarouselControls ? "opacity-100" : "opacity-0 md:opacity-0"}
              transition-opacity duration-200 rounded-sm
            `}
          >
            {currentImage + 1}/{images.length}
          </span>
        )}
        {images.length > 0 ? (
          <img
            src={images[currentImage]}
            alt={listing.title}
            className="w-full h-full object-cover rounded-t-sm transition-transform duration-300 ease-in-out"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500 text-center text-sm italic">
            Oops, we couldn't get the images for this listing.
          </div>
        )}
        {/* Carousel arrows */}
        {images.length > 1 && (
          <>
            <button
              className={`
                absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90
                rounded-full p-2 shadow flex items-center justify-center z-20
                transition-opacity duration-200
                ${showCarouselControls ? "opacity-100" : "opacity-0 md:opacity-0"}
              `}
              onClick={goPrev}
              tabIndex={showCarouselControls ? 0 : -1}
            >
              <img src={doubleArrowLeft} alt="Previous" className="w-6 h-6" />
            </button>
            <button
              className={`
                absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90
                rounded-full p-2 shadow flex items-center justify-center z-20
                transition-opacity duration-200
                ${showCarouselControls ? "opacity-100" : "opacity-0 md:opacity-0"}
              `}
              onClick={goNext}
              tabIndex={showCarouselControls ? 0 : -1}
            >
              <img src={doubleArrowRight} alt="Next" className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* --- CARD CONTENT --- */}
      <div className="px-4 pt-3 pb-2 rounded-b-sm">
        {/* Price and Save Icon */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-100 text-base">${price.toLocaleString()}</span>
          <button
            onClick={saved ? handleUnsave : handleSave}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            title={saved ? 'Unsave' : 'Save'}
            style={{ lineHeight: 0 }}
          >
            <img
              src={gem}
              alt="Save"
              className={`w-5 h-5 transition-all duration-200 ${
                saved ? 'filter-none' : 'grayscale opacity-60'
              }`}
              style={{ filter: saved ? 'drop-shadow(0 0 6px #22c55e)' : 'grayscale(1) opacity(0.6)' }}
            />
          </button>
        </div>
        {/* Details row */}
        <div className="flex items-center gap-2 text-gray-200 text-sm mb-0.5">
          {bedDisplay} <span className="mx-1 text-gray-500">|</span>
          {listing.bathrooms} bath <span className="mx-1 text-gray-500">|</span>
          {listing.size_sqft ? Number(listing.size_sqft).toFixed(0) : "—"} sqft
        </div>
        {/* Address row */}
        <div className="text-gray-400 text-xs leading-tight">
          {listing.addr_street}
          {listing.addr_unit ? `, Unit ${listing.addr_unit}` : ""}
          <br />
          {listing.area_name || listing.neighborhood}
        </div>
      </div>
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
