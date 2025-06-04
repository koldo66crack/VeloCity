// src/components/Navbar.jsx

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import velocity from "../assets/svg/navbar_logo.svg"; // Main logo
import velocityMenu from "../assets/svg/title_logo.svg"; // Double-arrow SVG
import dropdown from "../assets/svg/dropdown-svgrepo-com.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { openAuthModal } = useUI();

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Logo click handler
  const handleLogoClick = () => {
    if (user && user.id) {
      navigate(`/home/${user.id}`);
    } else {
      navigate("/home");
    }
  };

  return (
    <nav className="bg-white fixed w-full z-50 top-0 border-b border-[#34495e]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 relative">
        {/* ---- DESKTOP NAV ---- */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Left: Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
          >
            <img src={velocity} alt="VeloCity Logo" className="h-10 w-auto" />
          </div>

          {/* Right: Menu */}
          <div className="flex items-center gap-6">
            {!user ? (
              <button
                onClick={openAuthModal}
                className="text-sm font-medium text-gray-700 hover:text-[#34495e]"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <>
                <button
                  className="cursor-pointer text-gray-700 hover:text-[#34495e] font-medium"
                  onClick={() => navigate("/dashboard")}
                >
                  My Dashboard
                </button>
                {/* Account Dropdown */}
                <div className="relative group" ref={dropdownRef}>
                  <button
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-[#34495e]"
                    onClick={() => setDropdownOpen((v) => !v)}
                  >
                    {user.name || user.email}
                    <img
                      src={dropdown}
                      alt="dropdown"
                      className={`w-3 h-3 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg z-20 flex flex-col">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
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
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ---- MOBILE NAV ---- */}
        <div className="flex md:hidden w-full items-center justify-between">
          {/* Spacer (left) */}
          <div className="w-8"></div>

          {/* Centered Logo */}
          <div
            className="flex-1 flex justify-center cursor-pointer"
            onClick={handleLogoClick}
          >
            <img src={velocity} alt="VeloCity Logo" className="h-10 w-auto" />
          </div>

          {/* Right: Custom Menu Icon */}
          <button
            className={`flex items-center justify-center w-10 h-10 ml-auto transition-transform duration-300 ${
              menuOpen ? "rotate-90" : ""
            }`}
            aria-label="Open menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <img src={velocityMenu} alt="Open Menu" className="h-7 w-7" />
          </button>

          {/* Mobile Menu Drawer */}
          {menuOpen && (
            <div className="fixed top-16 right-3 w-60 bg-white shadow-xl border border-gray-200 animate-fadein z-50">
              <div className="flex flex-col p-3">
                {!user ? (
                  <button
                    onClick={() => {
                      openAuthModal();
                      setMenuOpen(false);
                    }}
                    className="w-full py-3 font-semibold text-[#34495e] hover:bg-gray-100 transition"
                  >
                    Sign In / Sign Up
                  </button>
                ) : (
                  <>
                    <button
                      className="w-full py-3 font-semibold text-[#34495e] hover:bg-gray-100 text-left"
                      onClick={() => {
                        navigate("/dashboard");
                        setMenuOpen(false);
                      }}
                    >
                      My Dashboard
                    </button>
                    {/* Account button */}
                    <div className="relative mt-2" ref={dropdownRef}>
                      <button
                        className="flex items-center justify-between w-full py-3 px-2 font-semibold text-[#34495e] hover:bg-gray-100"
                        onClick={() => setDropdownOpen((v) => !v)}
                      >
                        {user.name || user.email}
                        <img
                          src={dropdown}
                          alt="dropdown"
                          className={`ml-2 w-3 h-3 transition-transform duration-200 ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {dropdownOpen && (
                        <div className="absolute left-0 top-14 w-full bg-white border border-gray-100 shadow-lg flex flex-col z-10">
                          <Link
                            to="/profile"
                            className="px-4 py-2 text-sm text-[#34495e] hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="px-4 py-2 text-sm text-[#34495e] hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                          >
                            Settings
                          </Link>
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              handleSignOut();
                            }}
                            className="px-4 py-2 text-sm text-[#34495e] text-left hover:bg-gray-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// (Optional) Add to tailwind.config.js for animation
// theme: {
//   extend: {
//     keyframes: {
//       fadein: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
//     },
//     animation: {
//       fadein: 'fadein 0.2s ease',
//     },
//   },
// }

