import json
from datetime import datetime

# === Load Raw Files ===
with open("compass_listings.json") as f:
    compass_data = json.load(f)

with open("renthop_listings.json") as f:
    renthop_data = json.load(f)

with open("streeteasy_listings.json") as f:
    streeteasy_data = json.load(f)

# === Normalize Compass Listings ===
def normalize_compass(listing):
    return {
        "marketplace": "Compass",
        "title": listing["title"],
        "addr_street": listing["addr_street"],
        "addr_unit": None,
        "addr_city": "Manhattan",
        "addr_state": "NY",
        "addr_zip": listing.get("zip_code"),
        "price": listing["price"],
        "bedrooms": listing["bedrooms"],
        "bathrooms": listing["bathrooms"],
        "size_sqft": listing["sqft"],
        "photo_url": listing["photo_url"],
        "listed_by": listing["listed_by"],
        "area_name": None,
        "description": None,
        "is_featured": False,
        "created_at": datetime.now().isoformat(),
        "source_url": None,
    }

# === Normalize RentHop Listings ===
def normalize_renthop(listing):
    return {
        "marketplace": "RentHop",
        "title": listing["title"],
        "addr_street": listing["addr_street"],
        "addr_unit": None,
        "addr_city": "Manhattan",
        "addr_state": "NY",
        "addr_zip": listing.get("zip_code"),
        "price": listing["price"],
        "bedrooms": listing["bedrooms"],
        "bathrooms": listing["bathrooms"],
        "size_sqft": listing["sqft"],
        "photo_url": listing["photo_url"],
        "listed_by": listing["listed_by"],
        "area_name": None,
        "description": None,
        "is_featured": False,
        "created_at": datetime.now().isoformat(),
        "source_url": None,
    }

# === Normalize StreetEasy Listings ===
def normalize_streeteasy(listing):
    return {
        "marketplace": "StreetEasy",
        "title": listing["title"],
        "addr_street": listing["addr_street"],
        "addr_unit": listing.get("addr_unit"),
        "addr_city": listing.get("addr_city", "Manhattan"),
        "addr_state": listing.get("addr_state", "NY"),
        "addr_zip": listing.get("addr_zip"),
        "price": listing["price"],
        "bedrooms": listing.get("bedrooms"),
        "bathrooms": listing.get("bathrooms"),
        "size_sqft": listing.get("size_sqft"),
        "photo_url": listing.get("medium_image_uri"),
        "listed_by": listing.get("source_label"),
        "area_name": listing.get("area_name"),
        "description": listing.get("description"),
        "is_featured": listing.get("is_featured", False),
        "created_at": listing.get("created_at"),
        "source_url": listing.get("url"),
    }

# === Apply Normalization ===
normalized = (
    [normalize_compass(l) for l in compass_data] +
    [normalize_renthop(l) for l in renthop_data] +
    [normalize_streeteasy(l) for l in streeteasy_data]
)

# === Save to Combined File ===
with open("combined_listings.json", "w") as f:
    json.dump(normalized, f, indent=2)

print(f"✅ Combined {len(normalized)} listings and saved to combined_listings.json")
