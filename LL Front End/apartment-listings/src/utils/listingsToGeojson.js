// utils/listingsToGeojson.js
export function listingsToGeojson(listings) {
  // Group by building (street)
  const groups = {};
  listings.forEach(listing => {
    // Skip listings without coordinates
    if (!listing.addr_lat || !listing.addr_lon || !listing.addr_street) {
      return;
    }
    
    // Key by full street address (could include city/zip for more uniqueness if needed)
    const key = listing.addr_street.trim().toUpperCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(listing);
  });

  // Convert groups to GeoJSON Features
  return {
    type: "FeatureCollection",
    features: Object.entries(groups).map(([buildingKey, units]) => {
      const prices = units.map(u => u.net_effective_price || u.price || 0).filter(p => p > 0);
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(units[0].addr_lon), // should be same for all units
            parseFloat(units[0].addr_lat),
          ],
        },
        properties: {
          addr_street: buildingKey,
          count: units.length,
          listings: units,
          // Optionally: Aggregate info for marker popup
          minPrice: prices.length > 0 ? Math.min(...prices) : 0,
          maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
          lionScores: [...new Set(units.map(u => u.LionScore).filter(Boolean))],
        },
      };
    }),
  };
}
