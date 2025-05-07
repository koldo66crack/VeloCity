import { Link } from "react-router-dom";

export default function EmailConfirmed() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">✅ You're all set!</h1>
      <p className="mb-6">
        Your email has been confirmed. You can now log in to your account.
      </p>
      <Link
        to="/auth"
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
      >
        Go to Login
      </Link>
    </div>
  );
}
