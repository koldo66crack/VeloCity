// src/components/MapViewGoogle.jsx
import React, { useState, useMemo, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import Supercluster from "supercluster";
import { listingsToGeojson } from "../utils/listingsToGeojson"; // <-- import your util
import { Link } from "react-router-dom";

const COLUMBIA_UNIVERSITY_COORDS = { lat: 40.807384, lng: -73.963036 };
const containerStyle = { width: "100%", height: "100%" };

// Custom marker color and style
const MARKER_COLOR = "#34495e";
const MARKER_TEXT_COLOR = "#fff";

function getMarkerSize(count) {
  // Log-scale sizing: 30px minimum, up to 70px for huge clusters
  return Math.max(30, Math.min(70, 25 + 10 * Math.log10(count)));
}

export default function MapViewGoogle({ listings }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Memoized geojson conversion for performance
  const geojson = useMemo(() => listingsToGeojson(listings), [listings]);

  // Set up supercluster instance (memoized for performance)
  const supercluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 60,
      maxZoom: 20,
    });
    cluster.load(geojson.features);
    return cluster;
  }, [geojson]);

  // Track map bounds, zoom, clusters, and active marker
  const [mapRef, setMapRef] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(15);
  const [activeBuilding, setActiveBuilding] = useState(null); // building marker popup

  // Compute clusters for current view
  const clusters = useMemo(() => {
    if (!bounds) return [];
    return supercluster.getClusters(
      [bounds.west, bounds.south, bounds.east, bounds.north],
      zoom
    );
  }, [bounds, zoom, supercluster]);

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
      onLoad={map => {
        setMapRef(map);
        // Initial bounds
        const b = map.getBounds();
        if (b)
          setBounds({
            north: b.getNorthEast().lat(),
            east: b.getNorthEast().lng(),
            south: b.getSouthWest().lat(),
            west: b.getSouthWest().lng(),
          });
      }}
      onBoundsChanged={() => {
        if (!mapRef) return;
        const b = mapRef.getBounds();
        if (b)
          setBounds({
            north: b.getNorthEast().lat(),
            east: b.getNorthEast().lng(),
            south: b.getSouthWest().lat(),
            west: b.getSouthWest().lng(),
          });
        setZoom(mapRef.getZoom());
      }}
      options={{
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        clickableIcons: false,
      }}
    >
      {/* Columbia University marker */}
      <Marker
        position={COLUMBIA_UNIVERSITY_COORDS}
        icon={{
          url: "http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
          scaledSize: new window.google.maps.Size(32, 32),
        }}
        label={{ text: "🎓", fontSize: "18px" }}
        title="Columbia University"
      />

      {/* Clusters and markers */}
      {clusters.map((cluster, i) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const isCluster = !!cluster.properties.cluster;
        const count = isCluster ? cluster.properties.point_count : cluster.properties.count;
        const markerSize = getMarkerSize(count);

        // Style for our custom marker
        const markerHtml = `
          <div style="
            background: ${MARKER_COLOR};
            color: ${MARKER_TEXT_COLOR};
            width: ${markerSize}px;
            height: ${markerSize}px;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${Math.max(13, markerSize / 3)}px;
            border: 2.5px solid #fff;
            box-shadow: 0 2px 12px rgba(0,0,0,0.12);
            ">
            <div>${count} unit${count > 1 ? "s" : ""}</div>
          </div>
        `;

        return (
          <Marker
            key={cluster.id || i}
            position={{ lat, lng }}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="${markerSize}" height="${markerSize}">
                    <circle cx="${markerSize / 2}" cy="${markerSize / 2}" r="${
                    markerSize / 2 - 2.5
                  }" fill="${MARKER_COLOR}" stroke="#fff" stroke-width="3"/>
                    <text x="50%" y="55%" text-anchor="middle" fill="${
                      MARKER_TEXT_COLOR
                    }" font-size="${Math.max(
                    13,
                    markerSize / 3
                  )}" font-family="Arial" font-weight="bold" dy=".3em">${count}</text>
                  </svg>`
                ),
              scaledSize: new window.google.maps.Size(markerSize, markerSize),
            }}
            onClick={() => {
              if (isCluster) {
                // Zoom in to cluster
                const expansionZoom = Math.min(
                  supercluster.getClusterExpansionZoom(cluster.id),
                  20
                );
                mapRef.panTo({ lat, lng });
                mapRef.setZoom(expansionZoom);
              } else {
                setActiveBuilding(cluster);
              }
            }}
            title={
              isCluster
                ? `${count} units (zoom in for details)`
                : `${cluster.properties.addr_street} (${count} unit${
                    count > 1 ? "s" : ""
                  })`
            }
          />
        );
      })}

      {/* Listing scrollable panel for active marker */}
      {activeBuilding && (
        <div
          style={{
            position: "absolute",
            left: "30px",
            top: "30px",
            zIndex: 1000,
            background: "#fff",
            border: "2px solid #34495e",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(44,62,80,0.12)",
            maxWidth: "320px",
            maxHeight: "80vh",
            overflowY: "auto",
            padding: "18px",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-[#34495e] text-lg">
              {activeBuilding.properties.addr_street}
            </div>
            <button
              onClick={() => setActiveBuilding(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              title="Close"
            >
              ×
            </button>
          </div>
          {activeBuilding.properties.listings.map((listing) => (
            <div
              key={listing.id}
              className="border-b pb-2 mb-2 last:border-0 last:mb-0"
            >
              <div className="font-semibold text-[#34495e]">
                ${listing.price} – {listing.title}
              </div>
              <div className="text-sm text-gray-600">
                {listing.bedrooms || "Studio"}bd · {listing.bathrooms}ba ·{" "}
                {listing.size_sqft ? `${Number(listing.size_sqft).toFixed(2)} ft²` : "—"}
              </div>
              <div className="text-xs text-gray-500">{listing.LionScore}</div>
              <Link
                to={`/listing/${listing.id}`}
                className="inline-block mt-1 text-blue-600 hover:underline text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </GoogleMap>
  );
}
