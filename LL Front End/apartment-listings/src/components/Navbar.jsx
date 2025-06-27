import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useUI } from "../store/useUI";
import velocity from "../assets/svg/navbar_logo_white.svg";
import velocityMenu from "../assets/svg/title_logo_white.svg";
import search from "../assets/svg/search-svgrepo-com.svg";
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
  // const handleLogoClick = () => {
  //   if (user && user.id) {
  //     navigate(`/home/${user.id}`);
  //   } else {
  //     navigate("/home");
  //   }
  // };

  return (
    <nav className="bg-black/80 backdrop-blur-sm fixed w-full z-50 top-0 border-b border-green-500/30">
      <div className=" mx-auto flex items-center justify-between px-4 py-3 relative">
        {/* ---- DESKTOP NAV ---- */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Left: Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={velocity} alt="VeloCity Logo" className="h-10 w-auto" />
          </div>

          {/* Center: Search Bar */}
          {/* <div className="flex-grow flex justify-center max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search address..."
                className="pl-10 pr-4 py-2 bg-gray-900/50 border border-green-500/30 w-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-md transition-colors duration-200"
              />
              <img
                src={search}
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
            </div>
          </div> */}

          {/* Right: Menu */}
          <div className="flex items-center gap-6">
            {!user ? (
              <button
                onClick={openAuthModal}
                className="text-sm font-medium text-gray-300 hover:text-green-400 transition-colors duration-200"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <>
                <button
                  className="cursor-pointer text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium"
                  onClick={() => navigate("/dashboard")}
                >
                  My Dashboard
                </button>
                {/* Account Dropdown */}
                <div className="relative group" ref={dropdownRef}>
                  <button
                    className="flex items-center gap-1 text-sm text-gray-300 hover:text-green-400 transition-colors duration-200"
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
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-sm border border-green-500/30 shadow-lg z-20 flex flex-col rounded-md">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-green-500/20 hover:text-green-400 transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-green-500/20 hover:text-green-400 transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-green-500/20 hover:text-green-400 transition-colors duration-200"
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
            onClick={() => navigate("/")}
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
            <div className="fixed top-16 right-3 w-60 bg-gray-900/95 backdrop-blur-sm shadow-2xl border border-green-500/30 animate-fadein z-50 rounded-lg">
              <div className="flex flex-col p-3">
                {/* Search Bar for Mobile */}
                {/* <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search address..."
                    className="pl-10 pr-4 py-2 bg-gray-800/50 border border-green-500/30 w-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-md transition-colors duration-200"
                  />
                  <img
                    src={search}
                    alt="Search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  />
                </div> */}

                {!user ? (
                  <button
                    onClick={() => {
                      openAuthModal();
                      setMenuOpen(false);
                    }}
                    className="w-full py-3 font-semibold text-gray-300 hover:bg-green-500/20 hover:text-green-400 transition-colors duration-200 rounded-md"
                  >
                    Sign In / Sign Up
                  </button>
                ) : (
                  <>
                    <button
                      className="w-full py-3 font-semibold text-gray-300 hover:bg-green-500/20 hover:text-green-400 text-left transition-colors duration-200 rounded-md"
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
                        className="flex items-center justify-between w-full py-3 px-2 font-semibold text-gray-300 hover:bg-green-500/20 hover:text-green-400 transition-colors duration-200 rounded-md"
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
                        <div className="absolute left-0 top-14 w-full bg-gray-800/95 backdrop-blur-sm border border-green-500/30 shadow-lg flex flex-col z-10 rounded-md">
                          <Link
                            to="/profile"
                            className="px-4 py-2 text-sm text-gray-300 hover:bg-green-500/20 hover:text-green-400 transition-colors duration-200"
                            onClick={() => setMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="px-4 py-2 text-sm text-gray-300 hover:bg-green-500/20 hover:text-green-400 transition-colors duration-200"
                            onClick={() => setMenuOpen(false)}
                          >
                            Settings
                          </Link>
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              handleSignOut();
                            }}
                            className="px-4 py-2 text-sm text-gray-300 text-left hover:bg-green-500/20 hover:text-green-400 transition-colors duration-200"
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
