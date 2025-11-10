// Feature extraction utility for Smart Filters
import listingsData from '../data/combined_listings_with_lionscore.json';

// Curated list of common NYC apartment features
const CURATED_FEATURES = {
  // Laundry
  "in unit washer": ["in unit washer", "washer in unit", "in unit dryer", "dryer in unit", "washer dryer in unit", "in unit laundry", "laundry in unit"],
  "in building laundry": ["in building laundry", "laundry in building", "shared laundry", "community laundry"],
  "no laundry": ["no laundry", "no washer", "no dryer"],
  
  // Building Features
  "elevator": ["elevator", "lift", "elevator building"],
  "walk up": ["walk up", "walkup", "no elevator", "walk-up building"],
  "doorman": ["doorman", "concierge", "doorman building"],
  "gym": ["gym", "fitness center", "workout room", "exercise room"],
  "rooftop": ["rooftop", "roof deck", "roof access", "rooftop deck"],
  "garden": ["garden", "backyard", "outdoor space", "patio"],
  "balcony": ["balcony", "terrace", "outdoor balcony"],
  
  // Apartment Features
  "hardwood floors": ["hardwood floors", "hardwood", "wood floors"],
  "high ceilings": ["high ceilings", "tall ceilings", "ceiling height"],
  "exposed brick": ["exposed brick", "brick walls", "brick"],
  "renovated": ["renovated", "newly renovated", "recently renovated", "updated"],
  "new construction": ["new construction", "newly built", "new building"],
  "loft": ["loft", "loft style", "loft apartment"],
  "studio": ["studio", "studio apartment"],
  
  // Kitchen
  "dishwasher": ["dishwasher", "dish washer"],
  "stainless steel appliances": ["stainless steel appliances", "stainless appliances", "ss appliances"],
  "gas stove": ["gas stove", "gas range", "gas oven"],
  "island kitchen": ["island kitchen", "kitchen island"],
  "open kitchen": ["open kitchen", "open concept kitchen"],
  
  // Bathroom
  "en suite": ["en suite", "ensuite", "private bathroom", "attached bathroom"],
  "renovated bathroom": ["renovated bathroom", "updated bathroom", "new bathroom"],
  
  // Closet
  "walk in closet": ["walk in closet", "walk-in closet", "large closet"],
  "custom closet": ["custom closet", "built in closet", "closet system"],
  
  // Windows & Light
  "natural light": ["natural light", "natural sunlight", "sunlight", "bright"],
  "oversized windows": ["oversized windows", "large windows", "big windows"],
  "northern exposure": ["northern exposure", "north facing"],
  "southern exposure": ["southern exposure", "south facing"],
  
  // HVAC & Utilities
  "central ac": ["central ac", "central air", "central air conditioning"],
  "window ac": ["window ac", "window air conditioning"],
  "heat included": ["heat included", "heat and hot water included"],
  "hot water included": ["hot water included", "utilities included"],
  
  // Security & Access
  "intercom": ["intercom", "voice intercom", "video intercom"],
  "key fob": ["key fob", "key card", "building access"],
  "security": ["security", "building security", "secure building"],
  
  // Pets
  "pet friendly": ["pet friendly", "pets allowed", "dogs allowed", "cats allowed"],
  "no pets": ["no pets", "no dogs", "no cats"],
  
  // Parking
  "parking": ["parking", "car parking", "parking available"],
  "garage": ["garage", "parking garage"],
  
  // Location Features
  "near subway": ["near subway", "close to subway", "subway nearby"],
  "quiet": ["quiet", "quiet building", "quiet street"],
  "corner unit": ["corner unit", "corner apartment"],
  "private entrance": ["private entrance", "private entry"],
  
  // Special Features
  "fireplace": ["fireplace", "wood burning fireplace"],
  "wine fridge": ["wine fridge", "wine refrigerator"],
  "home office": ["home office", "office space", "work space"],
  "storage": ["storage", "storage unit", "additional storage"],
  "package room": ["package room", "package receiving", "package service"]
};

// Memoized feature extraction - only run once
let _extractedFeatures = null;
let _featureDictionary = null;
let _allFeatures = null;

// Extract features from listings data (memoized)
export function extractFeaturesFromListings() {
  if (_extractedFeatures) return _extractedFeatures;
  
  const extractedFeatures = new Map();
  
  listingsData.forEach(listing => {
    // Extract from amenities array
    if (listing.amenities && Array.isArray(listing.amenities)) {
      listing.amenities.forEach(amenity => {
        const normalized = amenity.toLowerCase().trim();
        if (!extractedFeatures.has(normalized)) {
          extractedFeatures.set(normalized, []);
        }
        extractedFeatures.get(normalized).push(listing.id);
      });
    }
    
    // Extract from description text
    if (listing.description) {
      const description = listing.description.toLowerCase();
      
      // Look for common patterns in descriptions
      const patterns = [
        /natural light|natural sunlight|sunlight/gi,
        /quiet|peaceful|tranquil/gi,
        /walk up|walkup|no elevator/gi,
        /renovated|updated|remodeled/gi,
        /new construction|newly built/gi,
        /loft|loft style/gi,
        /exposed brick|brick walls/gi,
        /high ceilings|tall ceilings/gi,
        /oversized windows|large windows/gi,
        /private entrance|private entry/gi,
        /corner unit|corner apartment/gi,
        /home office|office space/gi,
        /storage|storage unit/gi,
        /package room|package receiving/gi
      ];
      
      patterns.forEach(pattern => {
        const matches = description.match(pattern);
        if (matches) {
          const feature = matches[0].toLowerCase().trim();
          if (!extractedFeatures.has(feature)) {
            extractedFeatures.set(feature, []);
          }
          if (!extractedFeatures.get(feature).includes(listing.id)) {
            extractedFeatures.get(feature).push(listing.id);
          }
        }
      });
    }
  });
  
  _extractedFeatures = extractedFeatures;
  return extractedFeatures;
}

// Combine curated and extracted features (memoized)
export function buildFeatureDictionary() {
  if (_featureDictionary) return _featureDictionary;
  
  const extractedFeatures = extractFeaturesFromListings();
  const combinedFeatures = { ...CURATED_FEATURES };
  
  // Add extracted features that aren't already in curated list
  extractedFeatures.forEach((listingIds, feature) => {
    if (listingIds.length >= 3) { // Only include features that appear in at least 3 listings
      const canonicalFeature = feature.replace(/\s+/g, ' ').trim();
      if (!Object.values(combinedFeatures).some(synonyms => 
        synonyms.some(synonym => synonym.toLowerCase() === canonicalFeature)
      )) {
        combinedFeatures[canonicalFeature] = [canonicalFeature];
      }
    }
  });
  
  _featureDictionary = combinedFeatures;
  return combinedFeatures;
}

// Get all unique features for autocomplete (memoized)
export function getAllFeatures() {
  if (_allFeatures) return _allFeatures;
  
  const dictionary = buildFeatureDictionary();
  const allFeatures = [];
  
  Object.entries(dictionary).forEach(([canonical, synonyms]) => {
    synonyms.forEach(synonym => {
      allFeatures.push({
        canonical,
        synonym,
        display: canonical.charAt(0).toUpperCase() + canonical.slice(1)
      });
    });
  });
  
  _allFeatures = allFeatures;
  return allFeatures;
}

// Check if a listing matches a feature (optimized)
export function listingMatchesFeature(listing, feature) {
  const dictionary = buildFeatureDictionary();
  const synonyms = dictionary[feature] || [feature];
  
  // Check amenities
  if (listing.amenities && Array.isArray(listing.amenities)) {
    const listingAmenities = listing.amenities.map(a => a.toLowerCase());
    if (synonyms.some(synonym => 
      listingAmenities.some(amenity => amenity.includes(synonym.toLowerCase()))
    )) {
      return true;
    }
  }
  
  // Check description
  if (listing.description) {
    const description = listing.description.toLowerCase();
    if (synonyms.some(synonym => description.includes(synonym.toLowerCase()))) {
      return true;
    }
  }
  
  return false;
} 