import { useState, useEffect } from "react";
import { supabase }            from "../lib/supabaseClient";

export default function PreferencesForm({ userId }) {
  const [form, setForm] = useState({
    minBudget: "",
    maxBudget: "",
    bedrooms: "",
    maxDistance: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/preferences/${userId}`)
      .then((r) => r.json())
      .then((p) => {
        if (p) {
          setForm({
            minBudget: p.minBudget ?? "",
            maxBudget: p.maxBudget ?? "",
            bedrooms: p.bedrooms ?? "",
            maxDistance: p.maxDistance ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/preferences", {
      method: "POST", // creates or updates
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        minBudget: +form.minBudget || null,
        maxBudget: +form.maxBudget || null,
        bedrooms:  +form.bedrooms  || null,
        maxDistance: +form.maxDistance || null,
      }),
    });
    alert("Preferences saved!");
  };

  const handleDelete = async () => {
    await fetch(`http://localhost:3001/api/preferences/${userId}`, {
      method: "DELETE",
    });
    setForm({ minBudget: "", maxBudget: "", bedrooms: "", maxDistance: "" });
  };

  if (loading) return <p>Loading preferences…</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label>Min Budget</label>
        <input
          type="number"
          value={form.minBudget}
          onChange={(e) => setForm(f => ({ ...f, minBudget: e.target.value }))}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label>Max Budget</label>
        <input
          type="number"
          value={form.maxBudget}
          onChange={(e) => setForm(f => ({ ...f, maxBudget: e.target.value }))}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label>Bedrooms</label>
        <input
          type="number"
          value={form.bedrooms}
          onChange={(e) => setForm(f => ({ ...f, bedrooms: e.target.value }))}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label>Max Distance (miles)</label>
        <input
          type="number"
          value={form.maxDistance}
          onChange={(e) => setForm(f => ({ ...f, maxDistance: e.target.value }))}
          className="w-full border p-2 rounded"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Preferences
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="ml-4 text-red-600"
      >
        Delete Preferences
      </button>
    </form>
  );
}
