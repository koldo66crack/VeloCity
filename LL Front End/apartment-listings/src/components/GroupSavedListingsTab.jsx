// src/components/GroupSavedListingsTab.jsx
import React from "react";
import ListingGrid from "../components/ListingGrid";

export default function GroupSavedListingsTab({ savedIds, onSave, listings }) {
  if (listings.length === 0) {
    return <p className="text-gray-500">No group saved listings to show.</p>;
  }

  return (
    <ListingGrid
      listings={listings}
      savedIds={savedIds}
      onSave={onSave}
    />
  );
}
