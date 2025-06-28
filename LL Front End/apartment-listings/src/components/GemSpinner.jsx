import React from 'react';
import gem from '../assets/svg/gem-stone-svgrepo-com.svg';

const GemSpinner = ({ 
  message = "Loading your VeloCity experience...", 
  size = "medium",
  variant = "default" // "default", "map", "data", "save", "filter"
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12", 
    large: "w-16 h-16"
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "map":
        return {
          gemClass: "animate-spin",
          message: "Loading your map...",
          glowColor: "shadow-green-400/50"
        };
      case "data":
        return {
          gemClass: "animate-pulse",
          message: "Fetching your listings...",
          glowColor: "shadow-blue-400/50"
        };
      case "save":
        return {
          gemClass: "animate-bounce",
          message: "Loading...",
          glowColor: "shadow-yellow-400/50"
        };
      case "filter":
        return {
          gemClass: "animate-ping",
          message: "Applying filters...",
          glowColor: "shadow-purple-400/50"
        };
      default:
        return {
          gemClass: "animate-spin",
          message: message,
          glowColor: "shadow-green-400/50"
        };
    }
  };

  const { gemClass, message: variantMessage, glowColor } = getVariantStyles();

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Gem Spinner */}
      <div className="relative">
        {/* Glow Effect */}
        <div className={`absolute inset-0 ${glowColor} rounded-full blur-lg animate-pulse`}></div>
        
        {/* Main Gem */}
        <div className={`relative ${sizeClasses[size]} ${gemClass}`}>
          <img 
            src={gem} 
            alt="Loading..." 
            className="w-full h-full drop-shadow-lg"
          />
        </div>

        {/* Orbiting Elements for Map Variant */}
        {variant === "map" && (
          <>
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </>
        )}

        {/* Flowing Particles for Data Variant */}
        {variant === "data" && (
          <>
            <div className="absolute inset-0 animate-spin-reverse">
              <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute top-4 right-3 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
            </div>
          </>
        )}

        {/* Checkmark Animation for Save Variant */}
        {variant === "save" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Filter Bars for Filter Variant */}
        {variant === "filter" && (
          <div className="absolute inset-0 flex items-center justify-center space-x-1">
            <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
            <div className="w-1 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
          </div>
        )}
      </div>

      {/* Loading Message */}
      <div className="text-center">
        <p className="text-gray-300 text-sm font-medium animate-pulse">
          {variantMessage}
        </p>
        {/* Dots Animation */}
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default GemSpinner; 