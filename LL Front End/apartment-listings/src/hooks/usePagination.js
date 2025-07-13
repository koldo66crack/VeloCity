import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 16;

export function usePagination(listings = [], isLoading = false) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Get page from URL or default to 1
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(pageFromUrl);
  }, [searchParams]);

  // Calculate pagination data
  const paginationData = useMemo(() => {
    const totalItems = listings.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPageListings = listings.slice(startIndex, endIndex);

    return {
      currentPage,
      totalPages,
      totalItems,
      currentPageListings,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
    };
  }, [listings, currentPage]);

  // Update URL when page changes
  const goToPage = (page) => {
    if (page < 1 || page > paginationData.totalPages) return;
    
    setIsPageLoading(true);
    setCurrentPage(page);
    
    // Update URL
    const newSearchParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newSearchParams.delete("page");
    } else {
      newSearchParams.set("page", page.toString());
    }
    setSearchParams(newSearchParams);
    
    // Simulate loading delay for better UX
    setTimeout(() => setIsPageLoading(false), 300);
  };

  // Reset to page 1 when filters change
  const resetToFirstPage = () => {
    if (currentPage !== 1) {
      goToPage(1);
    }
  };

  // Navigation helpers
  const goToNextPage = () => {
    if (paginationData.hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (paginationData.hasPrevPage) {
      goToPage(currentPage - 1);
    }
  };

  // Show loading state when filters change
  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true);
    }
  }, [isLoading]);

  return {
    ...paginationData,
    goToPage,
    goToNextPage,
    goToPrevPage,
    resetToFirstPage,
    isPageLoading: isPageLoading || isLoading,
    ITEMS_PER_PAGE,
  };
} 