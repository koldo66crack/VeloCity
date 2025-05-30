import json
from datetime import datetime

# ——— Load raw JSON files ———
def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

compass_data   = load("compass_listings_full.json")
renthop_data   = load("renthop_listings_full.json")
streeteasy_data = load("streeteasy_listings.json")

# ——— Normalizers (unchanged) ———
def normalize_compass(l):
    return {
        "source_url":   l.get("url"),
        "marketplace":  "Compass",
        "title":        l["title"],
        "addr_street":  l["addr_street"],
        "addr_unit":    l.get("unit_number"),
        "addr_city":    "Manhattan",
        "addr_state":   "NY",
        "addr_zip":     l.get("zip_code"),
        "price":        int(l["monthly_rent"]),
        "bedrooms":     l["bedrooms"],
        "bathrooms":    l["bathrooms"],
        "size_sqft":    l["sqft"],
        "photo_url":    l["photo_url"],
        "listed_by":    l["listed_by"],
        "area_name":    l["area_name"],
        "description":  l["description"],
        "is_featured":  False,
        "created_at":   datetime.now().isoformat(),
        "amenities":    l["amenities"],
    }

def normalize_renthop(l):
    return {
        "source_url":   l.get("url"),
        "marketplace":  "RentHop",
        **{k: normalize_compass(l)[k] for k in [
            "title","addr_street","addr_unit","addr_city","addr_state",
            "addr_zip","price","bedrooms","bathrooms","size_sqft",
            "photo_url","listed_by","area_name","description",
            "is_featured","created_at","amenities"
        ]},
    }

def normalize_streeteasy(l):
    return {
        "source_url":   l.get("url"),
        "marketplace":  "StreetEasy",
        "title":        l["title"],
        "addr_street":  l["addr_street"],
        "addr_unit":    l.get("addr_unit")[1:],
        "addr_city":    l.get("addr_city", "Manhattan"),
        "addr_state":   l.get("addr_state", "NY"),
        "addr_zip":     l.get("addr_zip"),
        "price":        int(l["price"]),
        "bedrooms":     l.get("bedrooms"),
        "bathrooms":    l.get("bathrooms"),
        "size_sqft":    l.get("size_sqft"),
        "photo_url":    l.get("medium_image_uri"),
        "listed_by":    l.get("source_label"),
        "area_name":    l.get("area_name"),
        "description":  l.get("description"),
        "is_featured":  l.get("is_featured", False),
        "created_at":   l.get("created_at"),
    }

# ——— Build a single flat list ———
all_listings = (
    [normalize_compass(l)   for l in compass_data]   +
    [normalize_renthop(l)   for l in renthop_data]   +
    [normalize_streeteasy(l) for l in streeteasy_data]
)

# ——— Deduplicate ———
deduped = []
seen = {}  # key -> listing dict

for L in all_listings:
    street = L["addr_street"]
    unit   = L.get("addr_unit")
    price  = L["price"]

    # Dump listing if no street number
    if street[0].isdigit() is False:
        continue

    # if no unit, always keep
    if unit is None:
        L["marketplace"] = [L["marketplace"]]
        deduped.append(L)
        continue

    key = (street, price)
    if key not in seen:
        # start a list of marketplaces
        L["marketplace"] = [L["marketplace"]]
        seen[key] = L
        deduped.append(L)
    else:
        mp = L["marketplace"]
        if mp not in seen[key]["marketplace"]:
            seen[key]["marketplace"].append(mp)

# ——— Save result ———
with open("combined_listings.json", "w", encoding="utf-8") as f:
    json.dump(deduped, f, indent=2, ensure_ascii=False)

print(f"✅ {len(deduped)} unique listings saved to combined_listings.json")
print(f"ℹ️  {len(deduped) - len(streeteasy_data)} listings from outside StreetEasy")
