// src/components/MapViewGoogle.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import Supercluster from "supercluster";
import { listingsToGeojson } from "../utils/listingsToGeojson";
import { Link } from "react-router-dom";
import GemSpinner from "./GemSpinner";

const COLUMBIA_UNIVERSITY_COORDS = { lat: 40.807384, lng: -73.963036 };
const containerStyle = { width: "100%", height: "100%" };
const MARKER_COLOR = "#34495e";
const MARKER_TEXT_COLOR = "#fff";

function getMarkerSize(count) {
  // Log-scale sizing: 30px minimum, up to 70px for huge clusters
  return Math.max(30, Math.min(70, 25 + 10 * Math.log10(count)));
}

// Rectangle marker SVG for price or 'X listings'
function getRectMarkerSvg(label, color = '#fff', bg = '#34495e') {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='70' height='32'>
        <rect x='0' y='0' rx='8' ry='8' width='70' height='32' fill='${bg}' stroke='#fff' stroke-width='2'/>
        <text x='50%' y='55%' text-anchor='middle' fill='${color}' font-size='18' font-family='Arial' font-weight='bold' dy='.3em'>${label}</text>
      </svg>`
    )
  );
}

export default function MapViewGoogle({
  listings,
  onBoundsChange,
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Ref for click outside detection
  const popupRef = useRef(null);

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

  // Track map reference, bounds, zoom, and active marker
  const [mapRef, setMapRef] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(12); // Zoomed-out view
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [expandedClusterId, setExpandedClusterId] = useState(null);
  const [expandedMarkers, setExpandedMarkers] = useState([]);

  // Compute clusters for current view
  const clusters = useMemo(() => {
    if (!bounds) return [];
    return supercluster.getClusters(
      [bounds.west, bounds.south, bounds.east, bounds.north],
      zoom
    );
  }, [bounds, zoom, supercluster]);

  // Handle click outside popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActiveBuilding(null);
      }
    };
    if (activeBuilding) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeBuilding]);

  // Utility to get and emit bounds
  const emitBounds = (mapInstance) => {
    if (!mapInstance) return;
    const b = mapInstance.getBounds();
    if (b) {
      const newBounds = {
        north: b.getNorthEast().lat(),
        east: b.getNorthEast().lng(),
        south: b.getSouthWest().lat(),
        west: b.getSouthWest().lng(),
      };
      setBounds(newBounds);
      if (onBoundsChange) onBoundsChange(newBounds);
    }
    setZoom(mapInstance.getZoom());
  };

  // Fit map to show all listings on load
  const fitMapToAllListings = (mapInstance) => {
    if (!mapInstance || !listings.length) return;
    const bounds = new window.google.maps.LatLngBounds();
    listings.forEach(listing => {
      if (listing.addr_lat && listing.addr_lon) {
        bounds.extend({
          lat: parseFloat(listing.addr_lat),
          lng: parseFloat(listing.addr_lon)
        });
      }
    });
    mapInstance.fitBounds(bounds, 50);
  };

  // Handle cluster expansion
  const handleClusterClick = (cluster, lat, lng) => {
    // Get all points in this cluster
    const leaves = supercluster.getLeaves(cluster.id, Infinity);
    // Group by building (addr_street)
    const buildingMap = {};
    leaves.forEach(l => {
      const bkey = l.properties.addr_street;
      if (!buildingMap[bkey]) buildingMap[bkey] = [];
      buildingMap[bkey].push(l);
    });
    // Prepare markers: one per building
    const markers = Object.entries(buildingMap).map(([bkey, leaves]) => {
      const { addr_lat, addr_lon } = leaves[0].properties.listings[0];
      const listingsArr = leaves.flatMap(l => l.properties.listings);
      return {
        addr_street: bkey,
        lat: parseFloat(addr_lat),
        lng: parseFloat(addr_lon),
        listings: listingsArr,
      };
    });
    setExpandedClusterId(cluster.id);
    setExpandedMarkers(markers);
    // Optionally, zoom in a bit
    mapRef.panTo({ lat, lng });
    mapRef.setZoom(Math.min(zoom + 2, 20));
  };

  // Reset expanded cluster on zoom out
  useEffect(() => {
    setExpandedClusterId(null);
    setExpandedMarkers([]);
  }, [zoom]);

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-900/80">
        <GemSpinner message="Loading your map..." size="large" variant="map" />
      </div>
    );
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
      zoom={12}
      onLoad={map => {
        setMapRef(map);
        emitBounds(map);
        fitMapToAllListings(map);
      }}
      onBoundsChanged={() => {
        if (!mapRef) return;
        emitBounds(mapRef);
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

      {/* Render clusters or expanded markers */}
      {expandedClusterId
        ? expandedMarkers.map((marker, i) => {
            const isMulti = marker.listings.length > 1;
            const label = isMulti
              ? `${marker.listings.length} listings`
              : `$${marker.listings[0].price ? Math.round(marker.listings[0].price / 100) / 10 + 'k' : ''}`;
            return (
              <Marker
                key={marker.addr_street + i}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: getRectMarkerSvg(label),
                  scaledSize: new window.google.maps.Size(70, 32),
                }}
                onClick={() => {
                  if (isMulti) {
                    setActiveBuilding({
                      properties: {
                        addr_street: marker.addr_street,
                        listings: marker.listings,
                      },
                    });
                  } else {
                    setActiveBuilding({
                      properties: {
                        addr_street: marker.addr_street,
                        listings: marker.listings,
                      },
                    });
                  }
                }}
                title={isMulti ? `${marker.listings.length} listings` : `Price: $${marker.listings[0].price}`}
              />
            );
          })
        : clusters.map((cluster, i) => {
            const [lng, lat] = cluster.geometry.coordinates;
            const isCluster = !!cluster.properties.cluster;
            let count;
            if (isCluster) {
              // For clusters, sum all listings in all buildings within the cluster
              count = cluster.properties.point_count;
            } else {
              // For individual buildings, count total apartments
              count = cluster.properties.listings ? cluster.properties.listings.length : 1;
            }
            const markerSize = getMarkerSize(count);
            return (
              <Marker
                key={cluster.id || i}
                position={{ lat, lng }}
                icon={{
                  url:
                    "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(
                      `<svg xmlns='http://www.w3.org/2000/svg' width='${markerSize}' height='${markerSize}'>
                        <circle cx='${markerSize / 2}' cy='${markerSize / 2}' r='${
                        markerSize / 2 - 2.5
                      }' fill='${MARKER_COLOR}' stroke='#fff' stroke-width='3'/>
                        <text x='50%' y='55%' text-anchor='middle' fill='${MARKER_TEXT_COLOR}' font-size='${Math.max(
                        13,
                        markerSize / 3
                      )}' font-family='Arial' font-weight='bold' dy='.3em'>${count}</text>
                      </svg>`
                    ),
                  scaledSize: new window.google.maps.Size(markerSize, markerSize),
                }}
                onClick={() => {
                  if (isCluster) {
                    handleClusterClick(cluster, lat, lng);
                  } else {
                    setActiveBuilding(cluster);
                  }
                }}
                title={
                  isCluster
                    ? `${count} apartments (zoom in for details)`
                    : `${cluster.properties.addr_street} (${count} apartment${
                        count > 1 ? "s" : ""
                      })`
                }
              />
            );
          })}

      {/* Listing scrollable panel for active marker */}
      {activeBuilding && (
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            left: "30px",
            top: "30px",
            zIndex: 1000,
            background: "#fff",
            border: "2px solid #34495e",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(44,62,80,0.12)",
            maxWidth: "320px",
            maxHeight: "70vh",
            overflowY: "auto",
            padding: "10px 12px 10px 10px",
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {activeBuilding.properties.listings.map((listing, idx) => (
            <div
              key={listing.id || idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '6px 8px',
                boxShadow: '0 1px 4px rgba(44,62,80,0.07)',
              }}
            >
              {/* First image only, using photos_url */}
              {Array.isArray(listing.photos_url) && listing.photos_url.length > 0 && (
                <img
                  src={listing.photos_url[0]}
                  alt={listing.title}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                  onError={e => (e.target.style.display = 'none')}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#222', margin: '2px 0' }}>
                  ${listing.price?.toLocaleString()}
                </div>
                <div style={{ fontSize: 13, color: '#444', marginBottom: 2 }}>
                  {listing.bedrooms} bed | {listing.bathrooms} bath
                </div>
                <div style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {listing.addr_street} {listing.addr_unit ? `, Unit ${listing.addr_unit}` : ''} {listing.area_name || ''}
                </div>
                <Link
                  to={`/listing/${listing.id}`}
                  style={{
                    display: 'inline-block',
                    marginTop: 4,
                    color: '#2563eb',
                    fontWeight: 600,
                    fontSize: 13,
                    textDecoration: 'underline',
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
          {/* <button
            onClick={() => setActiveBuilding(null)}
            style={{
              alignSelf: 'flex-end',
              marginTop: 2,
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: 22,
              cursor: 'pointer',
              lineHeight: 1,
            }}
            title="Close"
          >
            ×
          </button> */}
        </div>
      )}
    </GoogleMap>
  );
}
