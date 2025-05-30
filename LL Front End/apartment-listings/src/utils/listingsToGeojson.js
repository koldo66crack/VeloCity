// utils/listingsToGeojson.js
export function listingsToGeojson(listings) {
  // Group by building (street)
  const groups = {};
  listings.forEach(listing => {
    // Key by full street address (could include city/zip for more uniqueness if needed)
    const key = listing.addr_street.trim().toUpperCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(listing);
  });

  // Convert groups to GeoJSON Features
  return {
    type: "FeatureCollection",
    features: Object.entries(groups).map(([buildingKey, units]) => ({
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
        minPrice: Math.min(...units.map(u => u.price)),
        maxPrice: Math.max(...units.map(u => u.price)),
        lionScores: [...new Set(units.map(u => u.LionScore))],
      },
    })),
  };
}
