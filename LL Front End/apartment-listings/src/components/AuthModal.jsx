import { useState } from "react";
import { createPortal } from "react-dom";
import { useUI } from "../store/useUI";
import LoginForm    from "./Login";
import RegisterForm from "./Register";

export default function AuthModal() {
  const { showAuthModal, closeAuthModal } = useUI();
  const [tab, setTab] = useState("login");        // "login" | "signup"

  if (!showAuthModal) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 space-y-6">
        {/* Tabs */}
        <div className="flex justify-center gap-4">
          <button
            className={`px-4 py-2 font-semibold ${
              tab === "login" ? "border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => setTab("login")}
          >
            Log In
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              tab === "signup" ? "border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {tab === "login" ? (
          <LoginForm />
        ) : (
          <RegisterForm switchToLogin={() => setTab("login")} />
        )}

        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute top-2 right-3 text-2xl leading-none text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
}
