// src/components/GroupActivityTab.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";

// Ensure this env var is set in your deploy environment
const BASE_URL = import.meta.env.VITE_API_URL;

export default function GroupActivityTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");

  // Fetch your group + members
  async function fetchGroup() {
    if (!user?.id) return;
    try {
      const res = await fetch(`${BASE_URL}/api/group/my?userId=${user.id}`);
      if (res.ok) {
        const { group, members } = await res.json();
        setGroup(group);
        setMembers(members);
      }
    } catch (err) {
      console.error("Failed to fetch group info:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGroup();
  }, [user?.id]);

  // Create new group
  const handleCreateGroup = async () => {
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
  };

  // Send an invite
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteStatus("Sending…");
    try {
      const res = await fetch(`${BASE_URL}/api/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: group.id,
          invitedEmail: inviteEmail,
          inviterId: user.id,
        }),
      });
      const body = await res.json();
      if (res.ok) {
        setInviteStatus(`Invite link: ${body.inviteLink}`);
        setInviteEmail("");
      } else {
        setInviteStatus(body.error || "Failed to send invite");
      }
    } catch (err) {
      console.error(err);
      setInviteStatus("Error sending invite");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Group Activity</h2>

      {loading ? (
        <p>Loading your group…</p>
      ) : members.length > 0 ? (
        <>
          <p className="mb-4">
            You are in a group with {members.length} member(s).
          </p>

          <ul className="mb-4 space-y-2">
            {members.map((m) => {
              const who = m.name || m.userId;
              return (
                <li key={m.id} className="flex justify-between">
                  <span>{who}</span>
                  <span className="text-sm text-gray-500">{m.status}</span>
                </li>
              );
            })}
          </ul>

          {showInviteForm ? (
            <form onSubmit={handleInviteSubmit} className="mb-4 space-y-2">
              <input
                type="email"
                className="border px-2 py-1 w-full"
                placeholder="Friend’s email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Send Invite
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => {
                    setShowInviteForm(false);
                    setInviteStatus("");
                  }}
                >
                  Cancel
                </button>
              </div>
              {inviteStatus && (
                <p className="text-sm mt-2 text-gray-700">{inviteStatus}</p>
              )}
            </form>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowInviteForm(true)}
            >
              Invite New Member
            </button>
          )}
        </>
      ) : (
        <>
          <p className="mb-4">You don’t have a group yet!</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleCreateGroup}
          >
            Create a Group
          </button>
        </>
      )}
    </div>
  );
}
