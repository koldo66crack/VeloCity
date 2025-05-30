import { useState } from "react";

const PERSONAL_LISTINGS = [
  {
    id: 1,
    address: "521 W 123rd St, #4B",
    price: 1450,
    beds: 3,
    baths: 1.5,
    lionScore: 89,
    complaints: 2,
    neighborhood: "Morningside Heights",
    amenities: ["Elevator", "Laundry", "Dishwasher"],
  },
  {
    id: 2,
    address: "1047 Amsterdam Ave, #3D",
    price: 1550,
    beds: 2,
    baths: 1,
    lionScore: 85,
    complaints: 1,
    neighborhood: "Manhattanville",
    amenities: ["Elevator", "Laundry"],
  },
];

const GROUP_LISTINGS = [
  {
    id: 3,
    address: "420 W 116th St, #6A",
    price: 1500,
    beds: 3,
    baths: 1.5,
    lionScore: 92,
    complaints: 0,
    neighborhood: "Morningside Heights",
    amenities: ["Elevator", "Laundry", "Dishwasher", "Doorman"],
  },
  {
    id: 4,
    address: "309 W 114th St, #2F",
    price: 1350,
    beds: 2,
    baths: 1,
    lionScore: 80,
    complaints: 5,
    neighborhood: "South Harlem",
    amenities: ["Laundry"],
  },
];

function ListingCard({ listing, selected, onSelect }) {
  return (
    <div
      className={`flex items-center gap-4 border-2 ${selected ? "border-[#34495e] bg-[#f5f6fa]" : "border-gray-300 bg-white"
        } p-4 mb-3 cursor-pointer transition`}
      style={{ borderRadius: 0, minWidth: 320, maxWidth: 370 }}
      onClick={() => onSelect(listing.id)}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect(listing.id)}
        className="accent-[#34495e] w-5 h-5"
        style={{ borderRadius: 0 }}
        onClick={e => e.stopPropagation()}
      />
      <div className="flex flex-col">
        <div className="font-bold text-[#34495e]">{listing.address}</div>
        <div className="text-black text-sm">
          ${listing.price} · {listing.beds}BR {listing.baths}BA · {listing.neighborhood}
        </div>
        <div className="text-black text-xs">
          LionScore: <b>{listing.lionScore}</b> · Complaints: <b>{listing.complaints}</b>
        </div>
        <div className="text-xs mt-1">
          {listing.amenities && listing.amenities.length
            ? listing.amenities.join(" · ")
            : ""}
        </div>
      </div>
    </div>
  );
}

export default function CompareSelector({
  selectedListings,
  setSelectedListings,
  onNext,
}) {
  const [personal] = useState(PERSONAL_LISTINGS);
  const [group] = useState(GROUP_LISTINGS);

  function handleSelect(id) {
    if (selectedListings.includes(id)) {
      setSelectedListings(selectedListings.filter(x => x !== id));
    } else if (selectedListings.length < 3) {
      setSelectedListings([...selectedListings, id]);
    }
  }

  const allListings = [...personal, ...group];
  const selectedObjects = selectedListings.map(
    id => allListings.find(l => l.id === id)
  ).filter(Boolean);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#34495e] mb-2">Personal Saved Listings</h2>
        <div>
          {personal.map(l => (
            <ListingCard
              key={l.id}
              listing={l}
              selected={selectedListings.includes(l.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#34495e] mb-2">Group Saved Listings</h2>
        <div>
          {group.map(l => (
            <ListingCard
              key={l.id}
              listing={l}
              selected={selectedListings.includes(l.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onNext(selectedObjects)}
          disabled={selectedListings.length < 2}
          className={`px-6 py-3 font-bold uppercase text-white ${selectedListings.length < 2
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#34495e] hover:bg-[#5d6d7e] cursor-pointer"
            }`}
          style={{ borderRadius: 0 }}
        >
          Next: Set Priorities
        </button>
      </div>
    </div>
  );
}
