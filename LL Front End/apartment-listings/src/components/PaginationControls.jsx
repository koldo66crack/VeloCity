import React from "react";
import doubleArrowLeft from "../assets/svg/double-arrow-left.svg";
import doubleArrowRight from "../assets/svg/double-arrow-right.svg";

function getSmartPageNumbers(currentPage, totalPages) {
  // Always show first 3, last 3, and current page if not in those
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  // Always show 1, 2, 3
  pages.push(1, 2, 3);

  // If current page is in the first 5, show up to page 5
  if (currentPage <= 5) {
    for (let i = 4; i <= 5; i++) {
      if (i < totalPages - 2) pages.push(i);
    }
    if (totalPages > 6) pages.push('ellipsis');
    pages.push(totalPages - 2, totalPages - 1, totalPages);
    return pages;
  }

  // If current page is in the last 5, show last 5
  if (currentPage >= totalPages - 4) {
    pages.push('ellipsis');
    for (let i = totalPages - 4; i <= totalPages; i++) {
      if (i > 3) pages.push(i);
    }
    return pages;
  }

  // Otherwise, show first 3, ellipsis, currentPage, ellipsis, last 3
  pages.push('ellipsis');
  pages.push(currentPage);
  pages.push('ellipsis');
  pages.push(totalPages - 2, totalPages - 1, totalPages);
  return pages;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  hasNextPage,
  hasPrevPage,
  goToPage,
  goToNextPage,
  goToPrevPage,
  isLoading = false,
}) {
  // Don't render if no pages
  if (totalPages <= 1) return null;

  const pageNumbers = getSmartPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col items-center gap-4 py-2 border-t border-gray-800 mb-8 md:mb-0">
      {/* Results count */}
      <div className="text-sm text-gray-400">
        Showing {startIndex}-{endIndex} of {totalItems.toLocaleString()} listings
      </div>

      {/* Desktop Pagination Controls */}
      <div className="hidden md:flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={goToPrevPage}
          disabled={!hasPrevPage || isLoading}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            hasPrevPage && !isLoading
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:shadow-lg"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
          style={{ width: 40, height: 40 }}
        >
          <img
            src={doubleArrowLeft}
            alt="Previous"
            className={`w-5 h-5 ${hasPrevPage && !isLoading ? "opacity-100" : "opacity-50"}`}
            style={{ filter: hasPrevPage && !isLoading ? "drop-shadow(0 0 4px #fff8)" : "none" }}
          />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === 'ellipsis') {
              return <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-500">...</span>;
            }
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                } ${isLoading ? "cursor-not-allowed" : ""}`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={goToNextPage}
          disabled={!hasNextPage || isLoading}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            hasNextPage && !isLoading
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:shadow-lg"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
          style={{ width: 40, height: 40 }}
        >
          <img
            src={doubleArrowRight}
            alt="Next"
            className={`w-5 h-5 ${hasNextPage && !isLoading ? "opacity-100" : "opacity-50"}`}
            style={{ filter: hasNextPage && !isLoading ? "drop-shadow(0 0 4px #fff8)" : "none" }}
          />
        </button>
      </div>

      {/* Mobile Pagination Controls */}
      <div className="flex md:hidden items-center gap-4 justify-center w-full sticky bottom-0 bg-gray-900 z-30 border-t border-gray-800 px-4">
        <button
          onClick={goToPrevPage}
          disabled={!hasPrevPage || isLoading}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            hasPrevPage && !isLoading
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:shadow-lg"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
          style={{ width: 44, height: 44 }}
        >
          <img
            src={doubleArrowLeft}
            alt="Previous"
            className={`w-6 h-6 ${hasPrevPage && !isLoading ? "opacity-100" : "opacity-50"}`}
            style={{ filter: hasPrevPage && !isLoading ? "drop-shadow(0 0 4px #fff8)" : "none" }}
          />
        </button>
        <span className="text-base text-gray-200 font-semibold min-w-[70px] text-center">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={!hasNextPage || isLoading}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            hasNextPage && !isLoading
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:shadow-lg"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
          style={{ width: 44, height: 44 }}
        >
          <img
            src={doubleArrowRight}
            alt="Next"
            className={`w-6 h-6 ${hasNextPage && !isLoading ? "opacity-100" : "opacity-50"}`}
            style={{ filter: hasNextPage && !isLoading ? "drop-shadow(0 0 4px #fff8)" : "none" }}
          />
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
          Loading...
        </div>
      )}
    </div>
  );
} 