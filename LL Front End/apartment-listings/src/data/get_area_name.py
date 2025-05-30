import json
import time
from geopy.geocoders import Nominatim
from fuzzywuzzy import process

# Load your JSON data
with open('combined_listings_with_lionscore.json', 'r', encoding='utf-8') as f:
    listings = json.load(f)

# Initialize geocoder
geolocator = Nominatim(user_agent="lion_lease_batch_geocoder", timeout=10)

# Your canonical Manhattan neighborhood list
MANHATTAN_NEIGHBORHOODS = [
    "Chelsea", "Chinatown", "East Harlem", "East Village", "Financial District",
    "Flatiron", "Gramercy Park", "Greenwich Village", "Hells Kitchen", "Lincoln Square",
    "Little Italy", "Lower East Side", "Midtown", "Midtown East", "Midtown South",
    "Midtown West", "Morningside", "Soho", "Tribeca", "Upper East Side",
    "Upper West Side", "West Harlem", "West Village"
]

# Reverse geocoding function
def get_neighborhood_from_coords(lat, lon):
    try:
        location = geolocator.reverse((lat, lon), exactly_one=True, addressdetails=True)
        if location:
            addr = location.raw.get('address', {})
            return addr.get('neighbourhood') or addr.get('suburb') or addr.get('city_district')
    except Exception as e:
        print(f"Reverse geocoding failed for ({lat}, {lon}): {e}")
    return None

# Fuzzy match to your Manhattan neighborhood list
def map_to_manhattan_neighborhood(name):
    if not name:
        return "Unknown"
    best_match, score = process.extractOne(name, MANHATTAN_NEIGHBORHOODS)
    return best_match if score >= 70 else "Unknown"

# Enrich listings with missing area_name
for listing in listings:
    if listing.get("area_name") is None and listing.get("addr_lat") and listing.get("addr_lon"):
        raw_hood = get_neighborhood_from_coords(listing["addr_lat"], listing["addr_lon"])
        mapped_hood = map_to_manhattan_neighborhood(raw_hood)
        listing["area_name"] = mapped_hood
        print(f'✔️ {listing["title"]} → {mapped_hood}')
        time.sleep(1)  # avoid hitting the rate limit of the API

# Save updated listings to a new file
with open('combined_listings_enriched.json', 'w', encoding='utf-8') as f:
    json.dump(listings, f, indent=2)

print("✅ Enriched listings saved to 'combined_listings_with_area_names.json'")
