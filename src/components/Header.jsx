/**
 * Header component.
 *
 * - Displays the application header with navigation links, a search bar, and user authentication controls.
 * - Includes a responsive design with a hamburger menu for mobile devices.
 * - Allows users to log in, log out, and navigate to different sections of the application.
 *
 * @returns {JSX.Element} The rendered header component.
 */

import { Link } from "react-router-dom";
import Logo from "../assets/logo-light.svg";
import SearchBar from "./SearchBar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";

// clear only volatile/session data (keeps per-user favorites)
function clearAppStorage() {
  localStorage.removeItem("cart-storage"); // adjust if you persist more slices
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setQuery } = useSearch();

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name?.toLowerCase();

  function handleLogout() {
    clearAppStorage();
    setMenuOpen(false);
    window.location.href = "/"; // or use a router navigate
  }

  // lock body scroll when the menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : prev || "";
    return () => (document.body.style.overflow = prev || "");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((v) => !v);

  const profileBase = username ? `/profile/${username}` : "/login";
  const tabLink = (slug) =>
    username ? `${profileBase}?tab=${slug}` : "/login";

  return (
    <header className="w-full bg-[color:var(--color-background)] shadow-md px-4 py-3 flex justify-between items-center relative z-50">
      {/* Logo */}
      <Link to="/" className="flex-shrink-0" onClick={() => setQuery("")}>
        {/* Desktop logo */}
        <img src={Logo} alt="Holidaze Logo" className="hidden sm:block h-15" />
        {/* Mobile logo */}
        <img
          src="/favicon-logo.svg"
          alt="Holidaze Logo"
          className="block sm:hidden h-10"
        />
      </Link>

      {/* Search (desktop only) */}
      <div className="hidden sm:flex flex-grow justify-center">
        <SearchBar className="mt-0 mx-auto" />
      </div>

      {/* Hamburger / Close */}
      <button
        type="button"
        onClick={toggleMenu}
        className="p-2 z-50 flex-shrink-0"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        aria-controls="site-menu"
      >
        {menuOpen ? (
          <XMarkIcon className="w-7 h-7 text-gray-800 transition-transform duration-300 rotate-90" />
        ) : (
          <Bars3Icon className="w-7 h-7 text-gray-800 transition-transform duration-300" />
        )}
      </button>

      {/* Drawer root (backdrop + panel) */}
      <div
        className={`fixed inset-0 z-40 ${
          menuOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Slide container prevents page overflow */}
        <div className="absolute inset-y-0 right-0 overflow-hidden">
          {/* Panel */}
          <nav
            id="site-menu"
            role="dialog"
            aria-modal="true"
            className={`relative h-full w-[85vw] max-w-[320px] sm:w-64
                        bg-[color:var(--color-background)] shadow-lg
                        transform transition-transform duration-300 ease-in-out
                        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex flex-col h-full justify-between p-6">
              <div className="space-y-4 mt-14 text-lg">
                <Link
                  to="/"
                  className="block hover:font-bold text-[color:var(--color-accent)]"
                  onClick={() => {
                    setQuery("");
                    closeMenu();
                  }}
                >
                  Home
                </Link>

                {/* Profile root */}
                <Link
                  to={profileBase}
                  className="block hover:font-bold text-[color:var(--color-accent)]"
                  onClick={() => {
                    setQuery("");
                    closeMenu();
                  }}
                >
                  Profile
                </Link>

                {/* Sub-links */}
                <div className="ml-3 space-y-2 text-base">
                  <Link
                    to={tabLink("upcoming")}
                    onClick={closeMenu}
                    className="block hover:font-bold text-[color:var(--color-accent)]"
                  >
                    - Upcoming bookings
                  </Link>
                  <Link
                    to={tabLink("previous")}
                    onClick={closeMenu}
                    className="block hover:font-bold text-[color:var(--color-accent)]"
                  >
                    - Previous bookings
                  </Link>
                  <Link
                    to={tabLink("my-venues")}
                    onClick={closeMenu}
                    className="block hover:font-bold text-[color:var(--color-accent)]"
                  >
                    - My venues
                  </Link>
                  <Link
                    to={tabLink("favorites")}
                    onClick={closeMenu}
                    className="block hover:font-bold text-[color:var(--color-accent)]"
                  >
                    - Favorites
                  </Link>
                </div>
              </div>

              {/* Auth Section */}
              <div className="space-y-2 text-sm">
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn-logout font-medium text-left w-full text-[color:var(--color-neutral)] hover:text-red-600"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block hover:text-[color:var(--color-accent)]"
                    onClick={closeMenu}
                  >
                    Login or Register
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
