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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900/95 backdrop-blur-sm w-full max-w-md shadow-2xl p-6 space-y-6 border border-green-500/30 rounded-lg">
        {/* Tabs */}
        <div className="flex justify-center gap-4">
          <button
            className={`px-4 py-2 font-semibold transition-colors duration-200 ${
              tab === "login" ? "border-b-2 border-green-500 text-green-400" : "text-gray-400 hover:text-green-400"
            }`}
            onClick={() => setTab("login")}
          >
            Log In
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors duration-200 ${
              tab === "signup" ? "border-b-2 border-green-500 text-green-400" : "text-gray-400 hover:text-green-400"
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
          className="absolute top-3 right-4 text-2xl leading-none text-gray-400 hover:text-green-400 transition-colors duration-200"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
}
