import { Link } from "react-router-dom";
import Logo from "../assets/logo-light.svg";
import SearchBar from "./SearchBar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Logout function
  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setMenuOpen(false);
    window.location.href = "/";
  }

  return (
    <header className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center relative z-50">
      <Link to="/" className="flex-shrink-0">
        {/* Desktop logo - hidden on small screens */}
        <img src={Logo} alt="Holidaze Logo" className="hidden sm:block h-15" />

        {/* Mobile logo - only visible on small screens */}
        <img
          src="/favicon-logo.svg"
          alt="Holidaze Logo"
          className="block sm:hidden h-10"
        />
      </Link>
      {/* Search field */}
      {/* Search bar visible only on larger screens */}
      <div className="hidden sm:flex flex-grow justify-center">
        <SearchBar />
      </div>

      {/* Hamburger menu icon */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 z-50 flex-shrink-0"
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-800 transition-transform duration-300 rotate-90" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-800 transition-transform duration-300" />
        )}
      </button>

      {/* Slide-in Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col h-full justify-between p-6">
          <div className="space-y-4 mt-14 text-lg">
            <Link
              to="/"
              className="block hover:font-bold text-[color:var(--color-accent)]"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="block hover:font-bold text-[color:var(--color-accent)]"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/profile"
              className="block hover:font-bold text-[color:var(--color-accent)]"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
          </div>

          {/* ✅ Auth Section */}
          <div className="space-y-2 text-sm">
            {user ? (
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block hover:text-green-700"
                onClick={() => setMenuOpen(false)}
              >
                Login or Register
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Overlay to close menu on background click */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
