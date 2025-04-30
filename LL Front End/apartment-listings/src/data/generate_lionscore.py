import pandas as pd
import numpy as np
from sklearn.model_selection import KFold
from sklearn.linear_model import LinearRegression
import os
import json

# === Paths ===
BASE_DIR = os.path.dirname(__file__)
INPUT_PATH = os.path.join(BASE_DIR, 'enriched_listings_with_complaints.json')
OUTPUT_PATH = os.path.join(BASE_DIR, 'listings_with_lionscore.json')

# === Load Listings ===
df_all = pd.read_json(INPUT_PATH)

# === Prepare Model Training Data ===
df_train = df_all[[
    'id', 'area_name', 'bedrooms', 'bathrooms',
    'size_sqft', 'price', 'no_fee', 'rooms_description'
]].copy()

# === Feature Engineering ===
df_train['is_studio'] = df_train['rooms_description'].str.lower().str.contains('studio').astype(int)
df_train['bedrooms'] = df_train['bedrooms'].fillna(1).replace(0, 1)
df_train['no_fee'] = df_train['no_fee'].apply(lambda x: 1 if x is True else 0)
df_train = df_train.dropna(subset=['price'])

area_medians = {
    'Morningside Heights': 500,
    'Hamilton Heights': 930,
    'Upper West Side': 793,
    'Manhattan Valley': 800
}
df_train['size_sqft'] = df_train.apply(
    lambda row: area_medians.get(row['area_name'], 800) if pd.isna(row['size_sqft']) else row['size_sqft'],
    axis=1
)

# === Encode & Train ===
df_encoded = pd.get_dummies(df_train.drop(columns=['rooms_description']), columns=['area_name'], drop_first=True)
X = df_encoded.drop(columns=['id', 'price'])
y = df_encoded['price']

kf = KFold(n_splits=10, shuffle=True, random_state=42)
predictions = []

for train_idx, test_idx in kf.split(X):
    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]

    model = LinearRegression()
    model.fit(X_train, y_train)

    fold_preds = pd.DataFrame({
        'id': df_train.iloc[test_idx]['id'].values,
        'actual_price': y_test.values,
        'predicted_price': model.predict(X_test)
    })

    predictions.append(fold_preds)

df_predictions = pd.concat(predictions, ignore_index=True)
df_predictions['residual_pct'] = (df_predictions['actual_price'] - df_predictions['predicted_price']) / df_predictions['predicted_price']

# === LionScore Rules ===
def compute_lionscore(row):
    if row['residual_pct'] < -0.25:
        return '🚨 Too Cheap to Be True'
    elif row['residual_pct'] < -0.10:
        return '🔥 Steal Deal'
    elif row['residual_pct'] > 0.20:
        return '💸 Overpriced'
    else:
        return '✅ Reasonable'

df_predictions['LionScore'] = df_predictions.apply(compute_lionscore, axis=1)

# === Merge Scores ===
lion_map = df_predictions.set_index('id')['LionScore'].to_dict()

# Replace NaNs with None for clean JSON output (null)
df_all = df_all.replace({np.nan: None})

listings = df_all.to_dict(orient='records')

for listing in listings:
    listing_id = listing.get('id')
    if listing_id in lion_map:
        listing['LionScore'] = lion_map[listing_id]


# === Write Clean JSON (no escaping, nothing tampered) ===
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(listings, f, indent=2, ensure_ascii=False)

print("✅ listings_with_lionscore.json saved — URLs untouched, LionScore injected cleanly.")