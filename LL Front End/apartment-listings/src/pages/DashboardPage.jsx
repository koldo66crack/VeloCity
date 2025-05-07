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
      const prefsObj = await safeJson(`${BASE_URL}/api/preferences/${userId}`, null);
      setPrefs(prefsObj);

      const savedRows = await safeJson(`${BASE_URL}/api/saved/${userId}`, []);
      setSavedIds(savedRows.map(r => String(r.listingId)));

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
    setSavedIds(rows.map(r => String(r.listingId)));
  };

  const handleSave = listingId => {
    if (!userId) return;
    setSavedIds(prev => [...new Set([...prev, listingId])]);
    postJson("${BASE_URL}/api/saved", { userId, listingId }).then(refreshSaved);
  };

  const findListingById = id =>
    enrichedListings.find(l => l.id === id);

  const visibleListings = savedIds.map(findListingById).filter(Boolean);

  if (!ready) return <p className="p-6">Loading your dashboard…</p>;

  return (
    <div className="p-6 pt-20">
      <h1 className="text-3xl font-bold mb-4">My Dashboard</h1>

      {/* components */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setTab("saved")}
          className={`px-4 py-2 rounded ${tab === "saved" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          Saved Listings ({savedIds.length})
        </button>
        <button
          onClick={() => setTab("prefs")}
          className={`px-4 py-2 rounded ${tab === "prefs" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          Preferences
        </button>
        <button
          onClick={() => setTab("group")}
          className={`px-4 py-2 rounded ${tab === "group" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          Group Activity
        </button>
      </div>

      {/* Content */}
      {tab === "saved" && (
        <SavedListingsTab
          savedIds={savedIds}
          onSave={handleSave}
          listings={visibleListings}
        />
      )}
      {tab === "prefs" && (
        <PreferencesTab prefs={prefs} userId={userId} />
      )}
      {tab === "group" && (
        <GroupActivityTab />
      )}
    </div>
  );
}
