import { useState, useEffect } from "react";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import Toast from "./Toast";

export default function Register({ switchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const { authLoading, error, signUp, clearError } = useAuth();
  const { closeAuthModal } = useUI();

  // Handle errors
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType("error");
      setShowToast(true);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name || !form.email || !form.password) {
      setToastMessage("Please fill in all fields");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (form.password.length < 6) {
      setToastMessage("Password must be at least 6 characters long");
      setToastType("error");
      setShowToast(true);
      return;
    }

    const { error } = await signUp(
      form.email,
      form.password,
      form.name.replace(/[^\x00-\x7F]/g, "")
    );

    if (error) {
      // Error is handled by useEffect above
      return;
    }

    // Success - show success message
    setToastMessage("Check your email to confirm your account!");
    setToastType("success");
    setShowToast(true);
    
    // Close modal and switch to login after a delay
    setTimeout(() => {
      closeAuthModal();
      switchToLogin();
    }, 2000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 bg-gray-900/50 border border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 rounded-md"
          required
          disabled={authLoading}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 bg-gray-900/50 border border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 rounded-md"
          required
          disabled={authLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 bg-gray-900/50 border border-green-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 rounded-md"
          required
          disabled={authLoading}
        />
        <button
          type="submit"
          disabled={authLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
        >
          {authLoading ? "Signing up…" : "Sign Up"}
        </button>
      </form>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}