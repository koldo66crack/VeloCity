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

const COLUMBIA_UNIVERSITY_COORDS = { lat: 40.816151, lng: -73.943653 };

function SaveChoiceModal({ open, onClose, onGroup, onPersonal }) {
  if (!open) return null;
  return (
    <div className="m-2 fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 shadow-2xl w-[340px]">
        <h3 className="text-lg font-bold mb-2 text-[#34495e]">Save Listing</h3>
        <p className="mb-6 text-gray-700">
          Where do you want to save this listing?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onGroup}
            className="bg-[#34495e] hover:bg-gray-800 text-white px-4 py-2 font-semibold"
          >
            Save to <span className="font-bold">Group Dashboard</span>
          </button>
          <button
            onClick={onPersonal}
            className="bg-white border border-[#34495e] text-[#34495e] hover:bg-[#f0f0f0] px-4 py-2 font-semibold"
          >
            Save to <span className="font-bold">My Dashboard</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 px-2 py-1 mt-1 text-sm"
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
  // --- Voting props ---
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

  // --- Voting State ---
  const upvoters = votes.filter((v) => v.vote > 0);
  const downvoters = votes.filter((v) => v.vote < 0);
  const currentUserVote =
    votes.find((v) => v.userId === currentUserId)?.vote || 0;

  const handleVoteClick = (voteValue) => {
    if (!user) return openAuthModal();
    if (currentUserVote === voteValue) return; // already voted
    onVote(listing.id, voteValue);
  };

  // --- Save & Unsave Logic ---
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
      setSaved(true); // revert if failed
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
      className={`relative bg-white shadow-md overflow-hidden transition-transform duration-300 transform border border-gray-200 hover:-translate-y-1 hover:shadow-lg ${
        isViewed ? "opacity-60" : ""
      }`}
    >
      <SaveChoiceModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onGroup={saveToGroup}
        onPersonal={saveToPersonal}
      />

      {isViewed && (
        <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1">
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
          <div className="h-48 bg-gray-100 overflow-hidden group">
            <img
              src={listing.photo_url}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
        )}

        <div className="p-4 space-y-2">
          <h3 className="text-base font-semibold text-[#34495e] hover:underline">
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
              <img src={size} className="w-4 h-4" /> {listing.size_sqft || "—"}{" "}
              ft²
            </span>
          </div>

          {distance !== null && (
            <p className="text-xs text-[#34495e] flex items-center gap-1">
              <img src={walking} className="w-4 h-4" />
              {distance} mi from Columbia
            </p>
          )}

          {listing.LionScore && (
            <div className="text-sm font-medium px-3 py-2 bg-gray-200 text-[#34495e] border border-gray-300">
              {listing.LionScore}
            </div>
          )}

          <p className="text-xs text-center text-gray-400 italic">
            Listed by {displayMarketplaces}
          </p>
        </div>
      </Link>

      {/* ---- GROUP VOTING UI ---- */}
      {isGroupCard && (
        <div className="flex flex-col items-center py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3 items-center mb-1">
            <button
              onClick={() => handleVoteClick(1)}
              className={`px-2 py-1 ${
                currentUserVote === 1
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-green-100"
              }`}
            >
              👍 {upvoters.length}
            </button>
            <button
              onClick={() => handleVoteClick(-1)}
              className={`px-2 py-1 ${
                currentUserVote === -1
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 hover:bg-red-100"
              }`}
            >
              👎 {downvoters.length}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {upvoters.length > 0 && (
              <span>
                <span className="font-bold text-green-700">+ Voted:</span>{" "}
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
                <span className="font-bold text-red-700">– Voted:</span>{" "}
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

      {/* --- Save/Unsave Button --- */}
      {!saved ? (
        <button
          onClick={handleSave}
          className="w-full py-2 text-sm font-semibold bg-[#34495e] hover:bg-gray-800 cursor-pointer text-white"
        >
          Save this listing
        </button>
      ) : (
        <button
          onClick={handleUnsave}
          className="w-full py-2 text-sm font-semibold bg-red-100 hover:bg-red-300 text-red-700"
        >
          Saved ✔ Unsave
        </button>
      )}
    </div>
  );
}
