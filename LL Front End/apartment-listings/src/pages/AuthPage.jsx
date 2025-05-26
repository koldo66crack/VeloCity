import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 shadow-md w-full max-w-md">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 text-sm font-medium ${
              isLogin ? "bg-[#34495e] text-white" : "bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 text-sm font-medium ${
              !isLogin ? "bg-[#34495e] text-white" : "bg-gray-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <Login />
        ) : (
          <Register switchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}