import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const signIn = useAuth((s) => s.signIn); // ✅ store helper
  const { closeAuthModal } = useUI(); // ✅ close modal
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(form.email, form.password);
    if (error) {
      alert(error.message);
    } else {
      /* 🔸 fetch the user, grab the id, then navigate */
      const {
        data: { user },
      } = await supabase.auth.getUser(); // import supabase at top!
      closeAuthModal();
      navigate(`/home/${user.id}`); // 👉 dynamic URL with uid
    }

    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Logging in…" : "Log In"}
      </button>
    </form>
  );
}
