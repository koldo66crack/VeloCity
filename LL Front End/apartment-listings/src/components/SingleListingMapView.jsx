// src/components/SingleListingMapView.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import university from '../assets/svg/university-svgrepo-com.svg';

const COLUMBIA_UNIVERSITY_COORDS = [40.816151, -73.943653];

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Columbia University icon
const columbiaIcon = new L.Icon({
  iconUrl: university,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Listing icon
const listingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function SingleListingMapView({ listing }) {
  if (!listing?.addr_lat || !listing?.addr_lon) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <div>No location data available for this listing</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={COLUMBIA_UNIVERSITY_COORDS} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Columbia University Marker */}
        <Marker
          position={COLUMBIA_UNIVERSITY_COORDS}
          icon={columbiaIcon}
        >
          <Popup>
            <div className="min-w-[200px]">
              <div className="font-bold text-lg text-blue-800">Columbia University</div>
              <div className="text-sm text-gray-700">116th St & Broadway, New York, NY 10027</div>
            </div>
          </Popup>
        </Marker>
        
        {/* Single Listing Marker */}
        <Marker 
          position={[listing.addr_lat, listing.addr_lon]}
          icon={listingIcon}
        >
          <Popup>
            <div className="min-w-[200px]">
              <div className="font-bold text-lg">${listing.net_effective_price || listing.price}</div>
              <div className="text-gray-700">{listing.title}</div>
              <div className="text-sm text-gray-500 mt-1">
                {listing.addr_street} {listing.addr_unit}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}