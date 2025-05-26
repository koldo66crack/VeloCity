// src/components/MapViewGoogle.jsx
import React, { useState, useMemo } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  MarkerClusterer,
} from "@react-google-maps/api";
import { Link } from "react-router-dom";

const COLUMBIA_UNIVERSITY_COORDS = { lat: 40.807384, lng: -73.963036 };
const containerStyle = { width: "100%", height: "100%" };

const lionScoreColorMap = {
  "🚨 Too Cheap to Be True": "red",
  "🔥 Steal Deal": "green",
  "✅ Reasonable": "yellow",
  "💸 Overpriced": "orange",
};

export default function MapViewGoogle({ listings }) {
  const [activeStreet, setActiveStreet] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Group listings by street
  const groups = useMemo(() => {
    const map = {};
    listings.forEach((l) => {
      const street = l.addr_street || "Unknown";
      if (!map[street]) map[street] = [];
      map[street].push(l);
    });
    return map;
  }, [listings]);

  if (!isLoaded) return <div className="p-4">🗺️ Loading map…</div>;
  if (!listings.length)
    return (
      <div className="h-full w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <div>No listings to display on map</div>
      </div>
    );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={COLUMBIA_UNIVERSITY_COORDS}
      zoom={15}
    >
      {/* Columbia pin */}
      <Marker
        position={COLUMBIA_UNIVERSITY_COORDS}
        icon={{
          url: "http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
          scaledSize: new window.google.maps.Size(32, 32),
        }}
        label={{ text: "🎓", fontSize: "18px" }}
        title="Columbia University"
      />

      <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
        {(clusterer) =>
          Object.entries(groups).map(([street, groupListings]) => {
            const { addr_lat: lat, addr_lon: lng } = groupListings[0];
            if (!lat || !lng) return null;

            const color =
              lionScoreColorMap[groupListings[0].LionScore] || "blue";
            const iconUrl = `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;

            return (
              <Marker
                key={street}
                position={{ lat, lng }}
                icon={{
                  url: iconUrl,
                  scaledSize: new window.google.maps.Size(32, 32),
                }}
                clusterer={clusterer}
                onClick={() => setActiveStreet(street)}
                title={`${street} (${groupListings.length} unit${
                  groupListings.length > 1 ? "s" : ""
                })`}
              >
                {activeStreet === street && (
                  <InfoWindow
                    position={{ lat, lng }} // ← explicit position
                    onCloseClick={() => setActiveStreet(null)}
                  >
                    <div className="max-w-xs max-h-64 overflow-y-auto p-2 space-y-2">
                      <h3 className="font-bold mb-2">{street}</h3>
                      {groupListings.map((listing) => {
                        const price =
                          listing.net_effective_price || listing.price;
                        return (
                          <div
                            key={listing.id}
                            className="border-b pb-2 last:border-0"
                          >
                            <div className="font-semibold">${price}</div>
                            <div className="text-sm text-gray-700">
                              {listing.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {listing.bedrooms}bd · {listing.bathrooms}ba ·{" "}
                              {listing.size_sqft || "—"}ft²
                            </div>
                            <Link
                              to={`/listing/${listing.id}`}
                              className="inline-block mt-1 text-blue-600 hover:underline text-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            );
          })
        }
      </MarkerClusterer>
    </GoogleMap>
  );
}
