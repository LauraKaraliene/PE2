import { Link } from "react-router-dom";
import Logo from "../assets/logo-light.svg";
import SearchBar from "./SearchBar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setQuery } = useSearch();

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name?.toLowerCase();

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setMenuOpen(false);
    window.location.href = "/";
  }

  // Prevent body scroll when the menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
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

      {/* Search (desktop) */}
      <div className="hidden sm:flex flex-grow justify-center">
        <SearchBar className="mt-0 mx-auto" />
      </div>

      {/* Hamburger / Close */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="p-2 z-50 flex-shrink-0"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        aria-controls="site-menu"
      >
        {menuOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-800 transition-transform duration-300 rotate-90" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-800 transition-transform duration-300" />
        )}
      </button>

      {/* Slide-in Sidebar */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full sm:w-64 bg-[color:var(--color-background)] shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col h-full justify-between p-6">
          <div className="space-y-4 mt-14 text-md">
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
              onClick={closeMenu}
            >
              Profile
            </Link>

            {/* Sub-links */}
            <div className="ml-3 space-y-2 text-sm">
              <Link
                to={tabLink("upcoming")}
                onClick={closeMenu}
                className="block hover:font-bold text-[color:var(--color-accent)]"
              >
                Upcoming bookings
              </Link>
              <Link
                to={tabLink("previous")}
                onClick={closeMenu}
                className="block hover:font-bold text-[color:var(--color-accent)]"
              >
                Previous bookings
              </Link>
              <Link
                to={tabLink("my-venues")}
                onClick={closeMenu}
                className="block hover:font-bold text-[color:var(--color-accent)]"
              >
                My venues
              </Link>
              <Link
                to={tabLink("favorites")}
                onClick={closeMenu}
                className="block hover:font-bold text-[color:var(--color-accent)]"
              >
                Favorites
              </Link>
            </div>
          </div>

          {/* Auth Section */}
          <div className="space-y-2 text-sm">
            {user ? (
              <button
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
        </nav>
      </div>

      {/* Overlay to close menu on background click */}
      {menuOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 cursor-default"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}
