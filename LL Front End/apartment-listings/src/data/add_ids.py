import json

# 1. Load your original JSON with explicit UTF-8 encoding
with open('combined_listings_with_lionscore.json', 'r', encoding='utf-8') as in_f:
    listings = json.load(in_f)

# 2. Append an 'id' field to each listing
for idx, listing in enumerate(listings):
    listing['id'] = str(idx)  # or: f"listing_{idx}"

# 3. Save the enriched data with UTF-8 encoding
with open('combined_listings_with_lionscore.json', 'w', encoding='utf-8') as out_f:
    json.dump(listings, out_f, indent=2, ensure_ascii=False)

print(f"Wrote {len(listings)} listings with IDs to combined_listings_with_ids.json")
