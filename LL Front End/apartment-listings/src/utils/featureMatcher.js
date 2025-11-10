// Efficient feature matching utility
import { buildFeatureDictionary } from './featureExtractor';

// Cache for feature matches
const featureMatchCache = new Map();

// Pre-compute feature matches for a listing
export function precomputeListingFeatures(listing) {
  const dictionary = buildFeatureDictionary();
  const matches = new Set();
  
  // Check amenities
  if (listing.amenities && Array.isArray(listing.amenities)) {
    const listingAmenities = listing.amenities.map(a => a.toLowerCase());
    
    Object.entries(dictionary).forEach(([canonical, synonyms]) => {
      if (synonyms.some(synonym => 
        listingAmenities.some(amenity => amenity.includes(synonym.toLowerCase()))
      )) {
        matches.add(canonical);
      }
    });
  }
  
  // Check description
  if (listing.description) {
    const description = listing.description.toLowerCase();
    
    Object.entries(dictionary).forEach(([canonical, synonyms]) => {
      if (synonyms.some(synonym => description.includes(synonym.toLowerCase()))) {
        matches.add(canonical);
      }
    });
  }
  
  return Array.from(matches);
}

// Check if a listing matches a feature (cached)
export function listingMatchesFeature(listing, feature) {
  const cacheKey = `${listing.id}-${feature}`;
  
  if (featureMatchCache.has(cacheKey)) {
    return featureMatchCache.get(cacheKey);
  }
  
  // If we haven't pre-computed features for this listing, do it now
  if (!listing._precomputedFeatures) {
    listing._precomputedFeatures = precomputeListingFeatures(listing);
  }
  
  const matches = listing._precomputedFeatures.includes(feature);
  featureMatchCache.set(cacheKey, matches);
  
  return matches;
}

// Clear cache when needed
export function clearFeatureCache() {
  featureMatchCache.clear();
} 