import React, { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router-dom";

export default function JoinGroupPage() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth(); // openAuthModal will show your modal
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const code = new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    if (!code) {
      setError("Missing invite code");
      setLoading(false);
      return;
    }

    fetch(`/api/invites/${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setInviteData(data);
        }
      })
      .catch(() => setError("Failed to load invite"))
      .finally(() => setLoading(false));
  }, [code]);

  const handleAccept = async () => {
    const res = await fetch(`/api/invites/${code}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    const body = await res.json();
    if (res.ok) {
      alert("You’ve joined the group!");
      navigate("/dashboard");
    } else {
      setError(body.error || "Something went wrong");
    }
  };

  if (loading) return <p className="p-4 mt-20">Loading invite…</p>;
  if (error) return <p className="p-4 mt-20 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 mt-20 max-w-xl mx-auto text-center border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        📨 Group Invitation
      </h2>
      <p className="mb-4 text-gray-700">
        <strong>{inviteData.inviterEmail}</strong> invited you to join their apartment hunt group.
      </p>

      {user?.id ? (
        <button
          onClick={handleAccept}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Accept Invite
        </button>
      ) : (
        <button
          onClick={openAuthModal}
          className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Sign in to Accept
        </button>
      )}
    </div>
  );
}
