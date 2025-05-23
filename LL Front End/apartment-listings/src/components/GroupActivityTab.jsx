import React, { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { supabase } from "../utils/supabaseClient";
import GroupSavedListingsTab from "../components/GroupSavedListingsTab";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function GroupActivityTab() {
  const { user } = useAuth();
  const [loading, setLoading]               = useState(true);
  const [group, setGroup]                   = useState(null);
  const [members, setMembers]               = useState([]);
  const [nameMap, setNameMap]               = useState({});
  const [showJoinForm, setShowJoinForm]     = useState(false);
  const [joinCode, setJoinCode]             = useState("");
  const [joinStatus, setJoinStatus]         = useState("");
  const [view, setView]                     = useState("details");    // "details" | "saved"
  const [groupSavedIds, setGroupSavedIds]   = useState([]);
  const [groupSavedListings, setGroupSavedListings] = useState([]);

  const displayName = (id) => nameMap[id] || id;

  async function fetchGroup() {
    if (!user?.id) return setLoading(false);
    setLoading(true);
    try {
      // 1) Fetch group + members
      const res = await fetch(`${BASE_URL}/api/group/my?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch group");
      const { group, members } = await res.json();
      setGroup(group);
      setMembers(members);

      // 2) Load full names
      const ids = [group.ownerId, ...members.map((m) => m.userId)];
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", ids);
      if (!profErr) {
        const map = {};
        profiles.forEach((p) => { map[p.id] = p.full_name });
        setNameMap(map);
      }

      // 3) Fetch group-saved IDs
      const savedRes = await fetch(`${BASE_URL}/api/group/saved/${group.id}`);
      let idsList = [];
      if (savedRes.ok) {
        const rows = await savedRes.json();
        idsList = rows.map((r) => String(r.listingId));
        setGroupSavedIds(idsList);
      } else {
        setGroupSavedIds([]);
      }

      // 4) Fetch full listing data for those IDs
      if (idsList.length) {
        const listRes = await fetch(`${BASE_URL}/api/listings?ids=${idsList.join(",")}`);
        if (listRes.ok) setGroupSavedListings(await listRes.json());
        else setGroupSavedListings([]);
      } else {
        setGroupSavedListings([]);
      }
    } catch (err) {
      console.error("Error in fetchGroup:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGroup();
  }, [user?.id]);

  async function handleCreateGroup() {
    if (!user?.id) return;
    try {
      await fetch(`${BASE_URL}/api/group/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      await fetchGroup();
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  }

  async function handleJoinByCode(e) {
    e.preventDefault();
    if (!user?.id || !joinCode) return;
    setJoinStatus("Joining...");
    try {
      const res = await fetch(`${BASE_URL}/api/group/joinByCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, groupCode: joinCode }),
      });
      const body = await res.json();
      if (res.ok) {
        setJoinStatus("Joined successfully!");
        setJoinCode("");
        await fetchGroup();
      } else {
        setJoinStatus(body.error || "Join failed.");
      }
    } catch (err) {
      console.error("Join error:", err);
      setJoinStatus("Error joining group.");
    }
  }

  async function handleGroupSave(listingId) {
    if (!user?.id || !group?.id) return;
    await fetch(`${BASE_URL}/api/group/saved`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, groupId: group.id, listingId }),
    });
    // refresh both tabs
    fetchGroup();
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Group Activity</h2>

      {/* TABS */}
      <div className="mb-6 flex space-x-4 border-b">
        <button
          className={`pb-2 ${view === "details"
            ? "border-b-2 border-blue-600"
            : "text-gray-500"}`}
          onClick={() => setView("details")}
        >
          Details
        </button>
        <button
          className={`pb-2 ${view === "saved"
            ? "border-b-2 border-blue-600"
            : "text-gray-500"}`}
          onClick={() => setView("saved")}
        >
          Saved Listings
        </button>
      </div>

      {view === "details" ? (
        loading ? (
          <p>Loading your group…</p>
        ) : members.length > 0 ? (
          <>
            <p className="mb-4">
              You are in a group with {members.length} member
              {members.length > 1 ? "s" : ""}.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Group created by: <strong>{displayName(group.ownerId)}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Group Code: <strong>{group.groupCode}</strong>
            </p>
            <ul className="mb-4 space-y-2">
              {members.map((m) => (
                <li key={m.id} className="flex justify-between">
                  <span>{displayName(m.userId)}</span>
                  <span className="text-sm text-gray-500">{m.status}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="mb-4">You don’t have a group yet!</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mb-2"
              onClick={handleCreateGroup}
            >
              Create a Group
            </button>
            <button
              className="text-blue-600 underline text-sm mb-4"
              onClick={() => setShowJoinForm(!showJoinForm)}
            >
              {showJoinForm ? "Cancel" : "Join group via code"}
            </button>
            {showJoinForm && (
              <form onSubmit={handleJoinByCode} className="space-y-2 max-w-sm">
                <input
                  type="text"
                  className="border px-2 py-1 w-full"
                  placeholder="Enter group code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Join Group
                </button>
                {joinStatus && (
                  <p className="text-sm text-gray-700">{joinStatus}</p>
                )}
              </form>
            )}
          </>
        )
      ) : (
        <GroupSavedListingsTab
          listings={groupSavedListings}
          savedIds={groupSavedIds}
          onSave={handleGroupSave}
        />
      )}
    </div>
  );
}
