import React from "react";

export default function ListingCountDisplay({ 
  totalItems, 
  isLoading = false,
  filters = null 
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
        Loading listings...
      </div>
    );
  }

  // Generate filter description
  const getFilterDescription = () => {
    if (!filters) return "";
    
    const descriptions = [];
    
    // Price range
    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? `$${filters.minPrice.toLocaleString()}` : "any";
      const max = filters.maxPrice ? `$${filters.maxPrice.toLocaleString()}` : "any";
      descriptions.push(`${min} - ${max}`);
    }
    
    // Bedrooms
    if (filters.bedrooms && filters.bedrooms !== "any") {
      if (filters.bedrooms === "Studio") {
        descriptions.push("Studio");
      } else if (filters.bedrooms === "4+") {
        descriptions.push("4+ bedrooms");
      } else {
        descriptions.push(`${filters.bedrooms} bedroom${filters.bedrooms !== "1" ? "s" : ""}`);
      }
    }
    
    // Bathrooms
    if (filters.bathrooms && filters.bathrooms !== "any") {
      descriptions.push(`${filters.bathrooms} bathroom${filters.bathrooms !== "1" ? "s" : ""}`);
    }
    
    // Areas
    if (filters.areas && filters.areas.length > 0) {
      if (filters.areas.length === 1) {
        descriptions.push(`in ${filters.areas[0]}`);
      } else {
        descriptions.push(`in ${filters.areas.length} areas`);
      }
    }
    
    return descriptions.length > 0 ? ` (${descriptions.join(", ")})` : "";
  };

  const filterDescription = getFilterDescription();
  const formattedCount = totalItems.toLocaleString();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
      <div className="text-lg font-semibold text-gray-200">
        {formattedCount} listings found{filterDescription}
      </div>
      {totalItems === 0 && (
        <div className="text-sm text-gray-400 mt-1">
          Try adjusting your filters to see more results
        </div>
      )}
    </div>
  );
} 