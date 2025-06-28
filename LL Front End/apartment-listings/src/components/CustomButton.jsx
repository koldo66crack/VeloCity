import React from 'react';

const CustomButton = ({ 
  onClick, 
  children, 
  className = "", 
  disabled = false,
  size = "small" // "small" | "large"
}) => {
  const sizeClasses = {
    small: "px-6 py-2 text-sm",
    large: "px-8 py-3 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative group ${sizeClasses[size]} font-semibold text-gray-100 bg-gray-800 rounded-lg overflow-hidden transition-transform duration-200 active:scale-95 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white group-active:text-white">
        {children}
      </span>
      {/* Top-left border */}
      <span className="absolute top-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 ease-out group-hover:w-1/2 group-active:w-1/2"></span>
      <span className="absolute top-0 left-0 w-0.5 h-0 bg-green-400 transition-all duration-300 ease-out group-hover:h-1/2 group-active:h-1/2"></span>
      {/* Bottom-right border */}
      <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-green-400 transition-all duration-300 ease-out group-hover:w-1/2 group-active:w-1/2"></span>
      <span className="absolute bottom-0 right-0 w-0.5 h-0 bg-green-400 transition-all duration-300 ease-out group-hover:h-1/2 group-active:h-1/2"></span>
    </button>
  );
};

export default CustomButton; 