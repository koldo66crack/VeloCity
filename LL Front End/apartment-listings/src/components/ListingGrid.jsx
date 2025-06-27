import React from "react";
import ListingCard from "./ListingCard";

export default function ListingGrid({
  listings,
  savedIds = [],
  viewedIds = [],
  onSave,
  onUnsave,
  onView,
  onGroupSave,
  // --- new voting props ---
  votesByListing = {},
  onVote = () => { },
  nameMap = {},
  currentUserId,
  isGroupGrid = false,
}) {

  return (
    <div className="mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          isSaved={savedIds.includes(listing.id)}
          isViewed={viewedIds.includes(listing.id)}
          onSave={() => onSave(listing.id)}
          onUnsave={onUnsave ? () => onUnsave(listing.id) : undefined}
          onGroupSave={onGroupSave ? () => onGroupSave(listing.id) : undefined}
          onView={() => onView(listing.id)}
          // --- voting props below! ---
          votes={votesByListing[listing.id] || []}
          onVote={onVote}
          nameMap={nameMap}
          currentUserId={currentUserId}
          isGroupCard={isGroupGrid}
        />
      ))}
    </div>
  );
}
