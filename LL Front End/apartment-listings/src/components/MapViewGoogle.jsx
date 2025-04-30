// src/components/MapViewGoogle.jsx
import React from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

const COLUMBIA_UNIVERSITY_COORDS = { lat: 40.807384, lng: -73.963036 };

const containerStyle = {
  width: "100%",
  height: "100%",
};

const lionScoreColorMap = {
  "🚨 Too Cheap to Be True": "red",
  "🔥 Steal Deal": "green",
  "✅ Reasonable": "yellow",
  "💸 Overpriced": "orange",
};

export default function MapViewGoogle({ listings }) {
  const [activeMarker, setActiveMarker] = React.useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCJKapYkEXB-jHM5htvhdCbuYG40haS0Cc",
  });

  const handleMarkerClick = (listingId) => {
    setActiveMarker(listingId);
  };

  const handleCloseClick = () => {
    setActiveMarker(null);
  };

  if (!isLoaded) {
    return <div className="p-4">🗺️ Loading map...</div>;
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="h-full w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div>No listings to display on map</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={COLUMBIA_UNIVERSITY_COORDS}
      zoom={15}
    >
      {/* 🎓 Columbia Marker */}
      <Marker
        position={COLUMBIA_UNIVERSITY_COORDS}
        icon={{
          url: "http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
          scaledSize: new window.google.maps.Size(32, 32),
        }}
        label={{
          text: "🎓",
          fontSize: "18px",
        }}
        title="Columbia University"
      />

      {/* 🏠 Listings */}
      {listings.map((listing) => {
        const pos = { lat: listing.addr_lat, lng: listing.addr_lon };
        if (!pos.lat || !pos.lng) return null;

        const price = listing.net_effective_price || listing.price;
        const fullAddress = `${listing.addr_street} ${listing.addr_unit}, ${listing.addr_city}, ${listing.addr_state} ${listing.addr_zip}`;
        const color = lionScoreColorMap[listing.LionScore] || "blue";
        const iconUrl = `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;

        return (
          <Marker
            key={listing.id}
            position={pos}
            icon={{
              url: iconUrl,
              scaledSize: new window.google.maps.Size(32, 32),
            }}
            onClick={() => handleMarkerClick(listing.id)}
            title={listing.title}
          >
            {activeMarker === listing.id && (
              <InfoWindow onCloseClick={handleCloseClick}>
                <div className="min-w-[200px]">
                  <div className="font-bold text-lg">${price}</div>
                  <div className="text-gray-700">{listing.title}</div>
                  {/* <div className="text-sm text-gray-500 mt-1">
                    {fullAddress}
                  </div> */}
                  <div className="text-sm text-gray-500 mt-1">
                    {listing.bedrooms} bed · {listing.bathrooms} bath ·{" "}
                    {listing.size_sqft || "—"} sqft
                  </div>
                  <div className="text-xs mt-1 text-green-700 font-bold">
                    {listing.LionScore || "Rating not available"}
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  );
}
