import json
import time
import requests

INPUT_PATH = "combined_listings_with_lionscore.json"
OUTPUT_PATH = "combined_listings_with_lionscore_30.json"

# === Geocoding Helper ===
def geocode_address(street, city="New York", state="NY", zip_code=None):
    if not street:
        return None, None

    query = f"{street}, {city}, {state}"
    if zip_code:
        query += f" {zip_code}"

    url = f"https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "format": "json",
        "limit": 1
    }

    try:
        response = requests.get(url, params=params, headers={"User-Agent": "LionLeaseApp/1.0"})
        data = response.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
        return None, None
    except Exception as e:
        print(f"❌ Failed to geocode: {query} — {e}")
        return None, None

# === Load Listings ===
with open(INPUT_PATH, "r", encoding="utf-8") as f:
    listings = json.load(f)

# === Fill Missing Coordinates for First 30 Only ===
count = 0
for listing in listings:
    if count >= 30:
        break

    if not listing.get("addr_lat") or not listing.get("addr_lon"):
        listing_id = listing.get("id", "UNKNOWN_ID")
        print(f"📍 Geocoding listing ID: {listing_id}...")

        lat, lon = geocode_address(
            listing.get("addr_street"),
            listing.get("addr_city", "New York"),
            listing.get("addr_state", "NY"),
            listing.get("addr_zip")
        )
        if lat and lon:
            listing["addr_lat"] = lat
            listing["addr_lon"] = lon
            print(f"✅ Success — ID: {listing_id}, lat: {lat}, lon: {lon}")
        else:
            print(f"⚠️ Could not find coordinates for ID: {listing_id}")

        count += 1
        time.sleep(1)  # Respect Nominatim's rate limit

# === Save Updated Listings ===
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(listings, f, indent=2, ensure_ascii=False)

print(f"\n🎯 Done! Updated coordinates for {count} listings → {OUTPUT_PATH}")
