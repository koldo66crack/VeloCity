import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import Toast from "./Toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const { user, authLoading, error, signIn, clearError } = useAuth();
  const { closeAuthModal } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  // Get intended destination from URL params or default to user's home
  const intendedDestination = new URLSearchParams(location.search).get('redirect') || `/home/${user?.id}`;

  // Handle successful login
  useEffect(() => {
    if (user && !authLoading) {
      closeAuthModal();
      clearError();
      navigate(intendedDestination, { replace: true });
    }
  }, [user, authLoading, closeAuthModal, navigate, intendedDestination, clearError]);

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
    if (!form.email || !form.password) {
      setToastMessage("Please fill in all fields");
      setToastType("error");
      setShowToast(true);
      return;
    }

    const { error } = await signIn(form.email, form.password);
    
    if (error) {
      // Error is handled by useEffect above
      return;
    }
    
    // Success - user will be redirected by useEffect when auth state updates
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          {authLoading ? "Logging in…" : "Log In"}
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
