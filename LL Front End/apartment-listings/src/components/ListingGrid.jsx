import React from "react";
import ListingCard from "./ListingCard";
import PaginationControls from "./PaginationControls";

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
  // --- pagination props ---
  paginationData = null,
  isLoading = false,
}) {

  return (
    <div className="flex flex-col h-full">
      {/* Listings Grid */}
      <div className="flex-1 overflow-y-auto pb-24 md:pb-0"> {/* Add bottom padding for sticky controls */}
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
      </div>

      {/* Sticky Pagination Controls on mobile, static on desktop */}
      {paginationData && (
        <div className="w-full md:static md:bg-transparent sticky bottom-0 bg-gray-900 z-20 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PaginationControls
              currentPage={paginationData.currentPage}
              totalPages={paginationData.totalPages}
              totalItems={paginationData.totalItems}
              startIndex={paginationData.startIndex}
              endIndex={paginationData.endIndex}
              hasNextPage={paginationData.hasNextPage}
              hasPrevPage={paginationData.hasPrevPage}
              goToPage={paginationData.goToPage}
              goToNextPage={paginationData.goToNextPage}
              goToPrevPage={paginationData.goToPrevPage}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
