import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import lionlease from "../assets/svg/new-york-famous-building-svgrepo-com.svg";
import search from "../assets/svg/search-svgrepo-com.svg";
import dropdown from "../assets/svg/dropdown-svgrepo-com.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { openAuthModal } = useUI();

  const handleSignOut = async () => {
    await signOut();
    navigate("/home");
  };

  return (
    <nav className="bg-white fixed w-full z-50 top-0 border-b border-blue-500">
      <div className="max-w-7xl flex items-center justify-between mx-auto px-4 py-3">
        {/* Logo */}
        <Link to="/home" className="flex items-center">
          <img src={lionlease} alt="Lion Lease Logo" className="w-10 h-10" />
          <span className="ml-2 text-3xl font-extrabold text-blue-600">
            LION LEASE
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-grow justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search address..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <img
              src={search}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            />
          </div>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-6">
          {!user ? (
            <button
              onClick={openAuthModal}
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Sign In / Sign Up
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/dashboard")}>My Dashboard</button>

              {/* Account Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600">
                  {user.name || user.email}
                  <img src={dropdown} alt="dropdown" className="w-3 h-3" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}