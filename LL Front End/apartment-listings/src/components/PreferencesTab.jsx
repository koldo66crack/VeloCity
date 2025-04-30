import React from "react";
import PreferencesForm from "../components/PreferencesForm";

export default function PreferencesTab({ prefs, userId }) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Your Saved Filters</h2>
      {prefs ? (
        <ul className="mb-6 space-y-2 text-gray-700">
          {prefs.minBudget != null && <li>Minimum Budget: ${prefs.minBudget}</li>}
          {prefs.maxBudget != null && <li>Maximum Budget: ${prefs.maxBudget}</li>}
          {prefs.bedrooms != null && <li>Bedrooms: {prefs.bedrooms}</li>}
          {prefs.bathrooms != null && <li>Bathrooms: {prefs.bathrooms}</li>}
          {prefs.maxDistance != null && <li>Max Distance: {prefs.maxDistance} miles</li>}
          {prefs.lionScores && <li>Lion Scores: {prefs.lionScores.join(", ")}</li>}
          {prefs.maxComplaints != null && <li>Max Complaints: {prefs.maxComplaints}</li>}
          <li>No Fee Only: {prefs.onlyNoFee ? "Yes" : "No"}</li>
          <li>Featured Only: {prefs.onlyFeatured ? "Yes" : "No"}</li>
          {prefs.areas && prefs.areas.length > 0 && (
            <li>Areas: {prefs.areas.join(", ")}</li>
          )}
        </ul>
      ) : (
        <p className="mb-6 text-gray-500">You haven’t set any preferences yet.</p>
      )}
      <PreferencesForm userId={userId} prefs={prefs || {}} />
    </>
  );
}
