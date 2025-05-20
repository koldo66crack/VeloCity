import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import { supabase } from "../lib/supabaseClient";

export default function Register({ switchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const signUp = useAuth((s) => s.signUp);
  const { closeAuthModal } = useUI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Step 1: Sign up
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name.replace(/[^\x00-\x7F]/g, ""),
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Step 2: Insert into profiles if user exists
    if (data?.user) {
      const { id } = data.user;

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id,
          full_name: form.name.replace(/[^\x00-\x7F]/g, ""),
        },
      ]);

      if (profileError) {
        console.error("Error inserting into profiles:", profileError.message);
        alert("Signup succeeded but failed to save profile info.");
      } else {
        alert("Signup successful! Check your email to confirm.");
      }
    }

    closeAuthModal();
    switchToLogin();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
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
        {loading ? "Signing up…" : "Sign Up"}
      </button>
    </form>
  );
}
