import json
import time
import requests

INPUT_PATH = "combined_listings_with_lionscore.json"
OUTPUT_PATH = "combined_listings_with_lionscore.json"

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
        print(f"Failed to geocode: {query} — {e}")
        return None, None

# === Load Listings ===
with open(INPUT_PATH, "r", encoding="utf-8") as f:
    listings = json.load(f)

# === Fill Missing Coordinates ===
for listing in listings:
    if not listing.get("addr_lat") or not listing.get("addr_lon"):
        lat, lon = geocode_address(
            listing.get("addr_street"),
            listing.get("addr_city", "New York"),
            listing.get("addr_state", "NY"),
            listing.get("addr_zip")
        )
        if lat and lon:
            listing["addr_lat"] = lat
            listing["addr_lon"] = lon
        time.sleep(1)  # Respect Nominatim's rate limit: 1 request/sec

# === Save Updated Listings ===
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(listings, f, indent=2, ensure_ascii=False)

print(f"✅ Saved listings with coordinates → {OUTPUT_PATH}")