import React, { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import enrichedListings from "../data/combined_listings_with_lionscore.json";

import SavedListingsTab from "../components/SavedListingsTab";
import PreferencesTab from "../components/PreferencesTab";
import GroupActivityTab from "../components/GroupActivityTab";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.id;

  const [savedIds, setSavedIds] = useState([]);
  const [prefs, setPrefs] = useState(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("saved");

  const safeJson = async (url, fallback) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      return data ?? fallback;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    if (!userId) return;
    (async () => {
      // const prefsObj = await safeJson(
      //   `${BASE_URL}/api/preferences/${userId}`,
      //   null
      // );
      // setPrefs(prefsObj);

      const savedRows = await safeJson(`${BASE_URL}/api/saved/${userId}`, []);
      setSavedIds(savedRows.map((r) => String(r.listingId)));

      setReady(true);
    })();
  }, [userId]);

  const postJson = (url, payload) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(console.error);

  const refreshSaved = async () => {
    if (!userId) return;
    const rows = await safeJson(`${BASE_URL}/api/saved/${userId}`, []);
    setSavedIds(rows.map((r) => String(r.listingId)));
  };

  const handleSave = (listingId) => {
    if (!userId) return;
    setSavedIds((prev) => [...new Set([...prev, listingId])]);
    postJson(`${BASE_URL}/api/saved`, { userId, listingId }).then(refreshSaved);
  };

  const handleUnsave = (listingId) => {
    if (!userId) return;
    setSavedIds((prev) => prev.filter((id) => id !== listingId));
    fetch(`${BASE_URL}/api/saved/${userId}/${listingId}`, {
      method: "DELETE",
    }).then(refreshSaved);
  };

  const findListingById = (id) => enrichedListings.find((l) => l.id === id);

  const visibleListings = savedIds.map(findListingById).filter(Boolean);

  if (!ready) return (
    <div className="pt-10 bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="text-gray-300 text-lg">Loading your dashboard...</div>
    </div>
  );

  return (
    <div className="pt-10 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[50px]">
        <h1 className="text-3xl font-bold mb-6 text-gray-200">My Dashboard</h1>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-1 border-b border-gray-700">
          <button
            onClick={() => setTab("saved")}
            className={`px-6 py-3 font-semibold transition-all duration-200 relative ${
              tab === "saved"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-gray-200 hover:border-b-2 hover:border-gray-600"
            }`}
          >
            Saved Listings ({savedIds.length})
            {tab === "saved" && (
              <div className="absolute inset-0 bg-green-400/10 rounded-t-lg transition-all duration-200"></div>
            )}
          </button>
          {/* <button
            onClick={() => setTab("prefs")}
            className={`px-6 py-3 font-semibold transition-all duration-200 relative ${
              tab === "prefs"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-gray-200 hover:border-b-2 hover:border-gray-600"
            }`}
          >
            Preferences
            {tab === "prefs" && (
              <div className="absolute inset-0 bg-green-400/10 rounded-t-lg transition-all duration-200"></div>
            )}
          </button> */}
          <button
            onClick={() => setTab("group")}
            className={`px-6 py-3 font-semibold transition-all duration-200 relative ${
              tab === "group"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-gray-200 hover:border-b-2 hover:border-gray-600"
            }`}
          >
            Group Activity
            {tab === "group" && (
              <div className="absolute inset-0 bg-green-400/10 rounded-t-lg transition-all duration-200"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
          {tab === "saved" && (
            <SavedListingsTab
              savedIds={savedIds}
              onSave={handleSave}
              onUnsave={handleUnsave}
              listings={visibleListings}
            />
          )}
          {/* {tab === "prefs" && <PreferencesTab prefs={prefs} userId={userId} />} */}
          {tab === "group" && <GroupActivityTab />}
        </div>
      </div>
    </div>
  );
}
