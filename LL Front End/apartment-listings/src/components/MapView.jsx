// src/components/MapView.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { calculateWalkingDistance } from '../utils/distanceUtils';
import university from '../assets/svg/university-svgrepo-com.svg';
import { Link } from 'react-router-dom';

import marker0 from '../assets/markers/marker-0.svg';
import marker1 from '../assets/markers/marker-1.svg';
import marker2 from '../assets/markers/marker-2.svg';

const COLUMBIA_UNIVERSITY_COORDS = [40.807384, -73.963036];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const columbiaIcon = new L.Icon({
  iconUrl: university,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const ratingMarkerMap = {
  0: marker0,
  1: marker1,
  2: marker2,
};

function createLocalMarkerIcon(rating) {
  const iconUrl = ratingMarkerMap[rating] || marker2;
  return new L.Icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
}

function MapController({ activeIndex, listings, allowHoverFlyTo }) {
  const map = useMap();
  const [isProgrammaticMove, setIsProgrammaticMove] = useState(false);

  useEffect(() => {
    if (!allowHoverFlyTo) return;
    if (activeIndex !== null && listings[activeIndex] && !isProgrammaticMove) {
      setIsProgrammaticMove(true);
      const { addr_lat: lat, addr_lon: lng } = listings[activeIndex];
      map.flyTo([lat, lng], 16, { duration: 1 });

      const marker = Object.values(map._layers).find(
        layer => layer.getLatLng &&
        layer.getLatLng().lat === lat &&
        layer.getLatLng().lng === lng
      );
      if (marker && marker.openPopup) marker.openPopup();

      setTimeout(() => setIsProgrammaticMove(false), 1000);
    }
  }, [activeIndex, map, listings, allowHoverFlyTo]);

  return null;
}

export default function MapView({ listings, activeListing, setActiveListing, onListingClick, allowHoverFlyTo = true }) {
  const [mapReady, setMapReady] = useState(false);

  if (!listings || listings.length === 0) {
    return (
      <div className="h-full w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div>No listings to display on map</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer 
        center={COLUMBIA_UNIVERSITY_COORDS} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        <Marker position={COLUMBIA_UNIVERSITY_COORDS} icon={columbiaIcon}>
          <Popup>
            <div className="min-w-[200px]">
              <div className="font-bold text-lg text-blue-800">Columbia University</div>
              <div className="text-sm text-gray-700">116th St & Broadway, New York, NY 10027</div>
              <div className="text-xs text-blue-600 mt-1">Reference point for all distance calculations</div>
            </div>
          </Popup>
        </Marker>

        {mapReady && listings.map((listing, index) => {
          if (!listing.addr_lat || !listing.addr_lon) return null;

          const price = listing.net_effective_price || listing.price;
          const fullAddress = `${listing.addr_street} ${listing.addr_unit}, ${listing.addr_city}, ${listing.addr_state} ${listing.addr_zip}`;
          const distance = calculateWalkingDistance(
            COLUMBIA_UNIVERSITY_COORDS[0],
            COLUMBIA_UNIVERSITY_COORDS[1],
            listing.addr_lat,
            listing.addr_lon
          );

          const markerIcon = createLocalMarkerIcon(listing.rating);

          return (
            <Marker 
              key={listing.id}
              position={[listing.addr_lat, listing.addr_lon]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onListingClick(listing),
                mouseover: () => allowHoverFlyTo && setActiveListing(index),
                mouseout: () => allowHoverFlyTo && setActiveListing(null)
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-bold text-lg">${price}</div>
                  <div className="text-gray-700">{listing.title}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {fullAddress}
                    <span className="ml-2 text-blue-600 font-medium">
                      {distance} mi from Columbia
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>{listing.bedrooms} bed · {listing.bathrooms} bath · {listing.size_sqft} sqft</span>
                  </div>
                  <div className="text-xs mt-1 text-green-700 font-bold">Rating: {listing.rating}/5</div>
                  <Link
                    to={`/listing/${listing.id}`}
                    className="block mt-2 text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapController 
          activeIndex={activeListing}
          listings={listings}
          allowHoverFlyTo={allowHoverFlyTo}
        />
      </MapContainer>
    </div>
  );
}
