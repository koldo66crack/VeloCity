import React, { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { supabase } from "../lib/supabaseClient";
import GroupSavedListingsTab from "../components/GroupSavedListingsTab";
import enrichedListings from "../data/combined_listings_with_lionscore.json";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function GroupActivityTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [nameMap, setNameMap] = useState({});
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinStatus, setJoinStatus] = useState("");
  const [view, setView] = useState("details"); // "details" | "saved"
  const [groupSavedIds, setGroupSavedIds] = useState([]);
  const [votesByListing, setVotesByListing] = useState({}); // { [listingId]: [ { userId, vote } ] }

  const displayName = (id) => nameMap[id] || id;

  // Fetch group + saved listings + names + votes
  async function fetchGroupAndVotes() {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      // 1) Fetch group + members
      const res = await fetch(`${BASE_URL}/api/group/my?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch group");
      const { group, members } = await res.json();
      setGroup(group);
      setMembers(members);

      // 2) If no group, clear dependent state and bail
      if (!group) {
        setNameMap({});
        setGroupSavedIds([]);
        setVotesByListing({});
        return;
      }

      // 3) Load profile names
      const ids = [group.ownerId, ...members.map((m) => m.userId)];
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", ids);
      if (!profErr && profiles) {
        const map = {};
        profiles.forEach((p) => {
          map[p.id] = p.full_name;
        });
        setNameMap(map);
      }

      // 4) Fetch group-saved listing IDs
      const savedRes = await fetch(`${BASE_URL}/api/group/saved/${group.id}`);
      let idsList = [];
      if (savedRes.ok) {
        const rows = await savedRes.json();
        idsList = rows.map((r) => String(r.listingId));
        setGroupSavedIds(idsList);
      } else {
        setGroupSavedIds([]);
      }

      // 5) Fetch votes for group listings
      if (group.id) {
        const votesRes = await fetch(`${BASE_URL}/api/group/votes/${group.id}`);
        if (votesRes.ok) {
          const allVotes = await votesRes.json();
          // Group by listingId
          const map = {};
          for (const vote of allVotes) {
            if (!map[vote.listingId]) map[vote.listingId] = [];
            map[vote.listingId].push(vote);
          }
          setVotesByListing(map);
        } else {
          setVotesByListing({});
        }
      }
    } catch (err) {
      console.error("Error in fetchGroupAndVotes:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGroupAndVotes();
    // eslint-disable-next-line
  }, [user?.id]);

  async function handleCreateGroup() {
    if (!user?.id) return;
    try {
      await fetch(`${BASE_URL}/api/group/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      await fetchGroupAndVotes();
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
        await fetchGroupAndVotes();
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
    try {
      const res = await fetch(`${BASE_URL}/api/group/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          groupId: group.id,
          listingId: String(listingId),
        }),
      });
      if (!res.ok) {
        console.error("Group save failed:", await res.text());
      }
      // re-fetch group state
      await fetchGroupAndVotes();
    } catch (err) {
      console.error("Error saving to group:", err);
    }
  }

  async function handleGroupUnsave(listingId) {
    if (!user?.id || !group?.id) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/group/saved/${group.id}/${listingId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        console.error("Group unsave failed:", await res.text());
      }
      await fetchGroupAndVotes();
    } catch (err) {
      console.error("Error unsaving from group:", err);
    }
  }

  // VOTING HANDLER!
  async function handleVote(listingId, vote) {
    // vote: +1 or -1
    if (!user?.id || !group?.id) return;
    try {
      const res = await fetch(`${BASE_URL}/api/group/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: group.id,
          listingId: String(listingId),
          userId: user.id,
          vote,
        }),
      });
      if (!res.ok) {
        console.error("Vote failed:", await res.text());
      }
      // refresh votes (no need to reload everything)
      await fetchGroupAndVotes();
    } catch (err) {
      console.error("Error voting:", err);
    }
  }

  // Filter enrichedListings by groupSavedIds
  const groupSavedListings = groupSavedIds
    .map((id) => enrichedListings.find((l) => l.id === id))
    .filter(Boolean);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Group Activity</h2>

      {/* TABS */}
      <div className="mb-6 flex space-x-4 border-b">
        <button
          className={`pb-2 ${
            view === "details" ? "border-b-2 border-[#34495e]" : "text-gray-500"
          }`}
          onClick={() => setView("details")}
        >
          Details
        </button>
        <button
          className={`pb-2 ${
            view === "saved" ? "border-b-2 border-[#34495e]" : "text-gray-500"
          }`}
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
                  <span className="text-sm text-gray-500">
                    Joined {new Date(m.joinedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="mb-4">You don’t have a group yet!</p>
            <div className="flex flex-col gap-3 max-w-sm">
              <button
                className="bg-[#34495e] hover:bg-gray-800 text-white px-4 py-2"
                onClick={handleCreateGroup}
              >
                Create a Group
              </button>
              <button
                className="bg-white border border-[#34495e] text-[#34495e] hover:bg-[#f0f0f0] px-4 py-2"
                onClick={() => setShowJoinForm(!showJoinForm)}
              >
                {showJoinForm ? "Cancel" : "Join Group via Code"}
              </button>
              {showJoinForm && (
                <form onSubmit={handleJoinByCode} className="space-y-3">
                  <input
                    type="text"
                    className="border border-gray-300 px-3 py-2 w-full"
                    placeholder="Enter group code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 w-full"
                  >
                    Join Group
                  </button>
                  {joinStatus && (
                    <p className="text-sm text-gray-700">{joinStatus}</p>
                  )}
                </form>
              )}
            </div>
          </>
        )
      ) : (
        <GroupSavedListingsTab
          listings={groupSavedListings}
          savedIds={groupSavedIds}
          onSave={handleGroupSave}
          onUnsave={handleGroupUnsave}
          votesByListing={votesByListing}
          onVote={handleVote}
          nameMap={nameMap}
          currentUserId={user?.id}
        />
      )}
    </div>
  );
}
