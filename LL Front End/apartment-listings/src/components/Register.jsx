import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { useUI }   from "../store/useUI";

export default function Register({ switchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const signUp            = useAuth((s) => s.signUp);
  const { closeAuthModal } = useUI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(
      form.email,
      form.password,
      form.name.replace(/[^\x00-\x7F]/g, "")
    );

    if (error) {
      alert(error.message);
    } else {
      closeAuthModal();   // close after successful sign-up
      alert("Check your email to confirm your account!");
      switchToLogin();    // optional: flip back to login tab
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-3 bg-gray-900/50 border border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 rounded-md"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full p-3 bg-gray-900/50 border border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 rounded-md"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full p-3 bg-gray-900/50 border border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 rounded-md"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
      >
        {loading ? "Signing up…" : "Sign Up"}
      </button>
    </form>
  );
}