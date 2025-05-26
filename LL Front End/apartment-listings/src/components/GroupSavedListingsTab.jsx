import React from "react";
import ListingGrid from "../components/ListingGrid";

// Accept new voting props and forward them to ListingGrid
export default function GroupSavedListingsTab({
  savedIds,
  onSave,
  onUnsave,
  listings,
  votesByListing = {},
  onVote = () => {},
  nameMap = {},
  currentUserId,
}) {
  if (listings.length === 0) {
    return <p className="text-gray-500">No group saved listings to show.</p>;
  }

  return (
    <ListingGrid
      listings={listings}
      savedIds={savedIds}
      onSave={onSave}
      onUnsave={onUnsave}
      // Voting-related props:
      votesByListing={votesByListing}
      onVote={onVote}
      nameMap={nameMap}
      currentUserId={currentUserId}
      isGroupGrid // (optional) to allow ListingGrid/ListingCard to render group-specific UI
    />
  );
}
