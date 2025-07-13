import React from 'react';
import gem from '../assets/svg/gem-stone-svgrepo-com.svg';

const ListingCardSkeleton = () => {
  return (
    <div className="relative bg-gray-700 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col w-full max-w-xl mx-auto animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-800 overflow-hidden flex items-center justify-center">
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={gem} 
            alt="" 
            className="w-16 h-16 opacity-20 animate-pulse"
          />
        </div>
        {/* Gem Icon Placeholder */}
        <div className="absolute top-3 right-3 p-1 rounded-full bg-gray-800/80">
          <img
            src={gem}
            alt=""
            className="w-7 h-7 opacity-30"
          />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 gap-2" style={{ minHeight: '180px' }}>
        <div className="flex flex-col gap-1">
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-600 rounded mb-1"></div>
          
          {/* Price Skeleton */}
          <div className="flex items-baseline gap-2">
            <div className="h-8 w-20 bg-gray-600 rounded"></div>
            <div className="h-4 w-24 bg-gray-600 rounded"></div>
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <div className="w-12 h-3 bg-gray-600 rounded"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <div className="w-16 h-3 bg-gray-600 rounded"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <div className="w-20 h-3 bg-gray-600 rounded"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <div className="w-24 h-3 bg-gray-600 rounded"></div>
          </div>
        </div>

        {/* Marketplace Skeleton */}
        <div className="text-right">
          <div className="w-32 h-3 bg-gray-600 rounded ml-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ListingCardSkeleton; 