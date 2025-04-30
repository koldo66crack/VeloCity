// src/services/geocodingService.js
export const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };
  
  // Cache geocoding results to avoid repeated API calls
  const geocodeCache = new Map();
  
  export const getCachedGeocode = async (address) => {
    if (geocodeCache.has(address)) {
      return geocodeCache.get(address);
    }
    const result = await geocodeAddress(address);
    if (result) {
      geocodeCache.set(address, result);
    }
    return result;
  };