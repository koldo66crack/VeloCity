import React, { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import { getAllFeatures } from '../utils/featureExtractor';
import { trackFeatureAdded, trackFeatureRemoved, trackSearchQuery } from '../services/smartFilterTracking';

const SmartFiltersTab = ({ selectedFeatures, setSelectedFeatures, onFiltersChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userSuggestion, setUserSuggestion] = useState('');
  const [showUserSuggestionModal, setShowUserSuggestionModal] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Initialize Fuse.js for fuzzy search (memoized)
  const allFeatures = useMemo(() => getAllFeatures(), []);
  const fuse = useMemo(() => new Fuse(allFeatures, {
    keys: ['synonym', 'canonical'],
    threshold: 0.3,
    includeScore: true
  }), [allFeatures]);
  
  // Analytics tracking
  const trackFeatureUsage = (feature) => {
    // Keep local storage for backward compatibility
    const usage = JSON.parse(localStorage.getItem('smartFilterUsage') || '{}');
    usage[feature] = (usage[feature] || 0) + 1;
    localStorage.setItem('smartFilterUsage', JSON.stringify(usage));
    
    // Track in database
    trackFeatureAdded(feature, {
      selectedFeatures,
      timestamp: new Date().toISOString()
    });
  };
  
  // Debounced search effect
  useEffect(() => {
    if (inputValue.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      const results = fuse.search(inputValue);
      const filteredSuggestions = results
        .slice(0, 8) // Limit to 8 suggestions
        .map(result => result.item)
        .filter(item => !selectedFeatures.includes(item.canonical));
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    }, 150); // 150ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [inputValue, fuse, selectedFeatures]);
  
  // Handle input changes
  const handleInputChange = (value) => {
    setInputValue(value);
    
    // Track search queries (debounced)
    if (value.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        trackSearchQuery(value.trim(), {
          suggestions: suggestions.length,
          timestamp: new Date().toISOString()
        });
      }, 1000); // Track after 1 second of no typing
      
      return () => clearTimeout(timeoutId);
    }
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (feature) => {
    if (!selectedFeatures.includes(feature.canonical)) {
      const newFeatures = [...selectedFeatures, feature.canonical];
      setSelectedFeatures(newFeatures);
      trackFeatureUsage(feature.canonical);
      onFiltersChange(newFeatures);
    }
    setInputValue('');
    setShowSuggestions(false);
  };
  
  // Handle feature removal
  const handleFeatureRemove = (featureToRemove) => {
    const newFeatures = selectedFeatures.filter(f => f !== featureToRemove);
    setSelectedFeatures(newFeatures);
    onFiltersChange(newFeatures);
    
    // Track feature removal
    trackFeatureRemoved(featureToRemove, {
      remainingFeatures: newFeatures,
      timestamp: new Date().toISOString()
    });
  };
  
  // Handle user suggestion submission
  const handleUserSuggestionSubmit = () => {
    if (userSuggestion.trim()) {
      // Store user suggestions for potential future features
      const userSuggestions = JSON.parse(localStorage.getItem('userFeatureSuggestions') || '[]');
      userSuggestions.push({
        suggestion: userSuggestion.trim(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('userFeatureSuggestions', JSON.stringify(userSuggestions));
      
      setUserSuggestion('');
      setShowUserSuggestionModal(false);
    }
  };
  
  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative" ref={inputRef}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Type features like 'in unit washer', 'elevator', 'natural light'..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((feature, index) => (
              <button
                key={`${feature.canonical}-${index}`}
                onClick={() => handleSuggestionSelect(feature)}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors border-b border-gray-600 last:border-b-0"
              >
                <div className="font-medium">{feature.display}</div>
                {feature.synonym !== feature.canonical && (
                  <div className="text-sm text-gray-400">Matches: {feature.synonym}</div>
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* No suggestions found */}
        {showSuggestions && suggestions.length === 0 && inputValue.trim() && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 p-4">
            <div className="text-gray-400 text-center">
              No matching features found
            </div>
          </div>
        )}
      </div>
      
      {/* Selected Features */}
      {selectedFeatures.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-300">Selected Features:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-full text-sm"
              >
                <span>{feature}</span>
                <button
                  onClick={() => handleFeatureRemove(feature)}
                  className="text-white hover:text-red-200 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* User Suggestion Button */}
      <div className="pt-2">
        <button
          onClick={() => setShowUserSuggestionModal(true)}
          className="text-sm text-green-400 hover:text-green-300 transition-colors underline"
        >
          Suggest a new feature
        </button>
      </div>
      
      {/* User Suggestion Modal */}
      {showUserSuggestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-4">
              Suggest a New Feature
            </h3>
            <textarea
              value={userSuggestion}
              onChange={(e) => setUserSuggestion(e.target.value)}
              placeholder="Describe a feature you'd like to filter by (e.g., 'something good under $2000/month', 'near subway', 'with balcony')"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-green-400 resize-none"
              rows="4"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUserSuggestionSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowUserSuggestionModal(false);
                  setUserSuggestion('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartFiltersTab; 