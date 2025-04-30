// src/utils/distanceUtils.js
export const calculateWalkingDistance = (lat1, lon1, lat2, lon2) => {
    // Convert degrees to radians
    const toRad = x => x * Math.PI / 180;
    
    // Haversine formula
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Convert to miles and round to 1 decimal
    const miles = (distance * 0.621371).toFixed(1);
    return parseFloat(miles);
  };