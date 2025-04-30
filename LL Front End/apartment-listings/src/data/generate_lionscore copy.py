import pandas as pd
import numpy as np
import json
from sklearn.model_selection import KFold
from sklearn.linear_model import LinearRegression

# === Load Listings ===
with open("combined_listings_with_complaints.json", "r", encoding="utf-8") as f:
    listings = json.load(f)

# === Convert to DataFrame ===
df_all = pd.DataFrame(listings)

# === Preprocessing & Feature Engineering ===

def safe_numeric(val, default=1):
    try:
        return float(str(val).strip().replace("â€”", "").replace("—", "").replace(",", ""))
    except:
        return default
    
# Normalize 'Studio' → 1 and fill missing values
df_all['bedrooms'] = df_all['bedrooms'].apply(lambda x: 1 if str(x).strip().lower() == 'studio' else x)
df_all['bedrooms'] = df_all['bedrooms'].apply(safe_numeric).fillna(1).replace(0, 1)

df_all['bathrooms'] = df_all['bathrooms'].apply(safe_numeric).fillna(1)
df_all['size_sqft'] = df_all['size_sqft'].apply(safe_numeric).fillna(500)
df_all['price'] = df_all['price'].apply(safe_numeric)
df_all['area_name'] = df_all['area_name'].fillna("Unknown")
df_all = df_all.dropna(subset=['price', 'title'])

# Use 'title' as unique key
df_train = df_all[['title', 'area_name', 'bedrooms', 'bathrooms', 'size_sqft', 'price']].copy()

# One-hot encode area_name
df_encoded = pd.get_dummies(df_train, columns=['area_name'], drop_first=True)
X = df_encoded.drop(columns=['title', 'price'])
y = df_encoded['price']

# === K-Fold Linear Regression ===
kf = KFold(n_splits=10, shuffle=True, random_state=42)
predictions = []

for train_idx, test_idx in kf.split(X):
    model = LinearRegression()
    model.fit(X.iloc[train_idx], y.iloc[train_idx])
    fold_preds = pd.DataFrame({
        'title': df_train.iloc[test_idx]['title'].values,
        'actual_price': y.iloc[test_idx].values,
        'predicted_price': model.predict(X.iloc[test_idx])
    })
    predictions.append(fold_preds)

df_predictions = pd.concat(predictions, ignore_index=True)
df_predictions['residual_pct'] = (df_predictions['actual_price'] - df_predictions['predicted_price']) / df_predictions['predicted_price']

# === LionScore Logic ===
def compute_lionscore(residual_pct):
    if residual_pct < -0.25:
        return "🚨 Too Cheap to Be True"
    elif residual_pct < -0.10:
        return "🔥 Steal Deal"
    elif residual_pct > 0.20:
        return "💸 Overpriced"
    else:
        return "✅ Reasonable"

df_predictions['LionScore'] = df_predictions['residual_pct'].apply(compute_lionscore)

# === Inject LionScore into Listings ===
lion_map = df_predictions.set_index('title')['LionScore'].to_dict()
for listing in listings:
    title = listing.get('title')
    if title in lion_map:
        listing['LionScore'] = lion_map[title]

# === Save Output ===
with open("combined_listings_with_lionscore.json", "w", encoding="utf-8") as f:
    json.dump(listings, f, indent=2, ensure_ascii=False)

print("✅ LionScores injected and saved to combined_listings_with_lionscore.json")