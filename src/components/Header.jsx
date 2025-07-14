import { Link } from "react-router-dom";
import Logo from "../assets/logo-light.svg";
import SearchIcon from "../assets/icons/search.svg";
import HamburgerIcon from "../assets/icons/hamburger.svg";
import CloseIcon from "../assets/icons/close.svg";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center relative z-50">
      <Link to="/">
        <img src={Logo} alt="Holidaze Logo" className="h-20" />
      </Link>

      <div className="relative w-full max-w-md mx-4 hidden sm:block">
        <input
          type="text"
          placeholder="Search destinations"
          className="w-full pl-4 pr-10 py-2.5 rounded text-sm shadow-sm border border-gray-300 focus:outline-none"
        />
        <img
          src={SearchIcon}
          alt="Search Icon"
          className="absolute right-3 top-2.5 h-6 w-6"
        />
      </div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 z-50"
        aria-label="Toggle menu"
      >
        <img
          src={menuOpen ? CloseIcon : HamburgerIcon}
          alt="Menu"
          className={`w-6 h-6 transition-transform duration-300 ${
            menuOpen ? "rotate-90" : "rotate-0"
          }`}
        />
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
          <div className="space-y-2 text-sm">
            <Link
              to="/login"
              className="block hover:text-green-700"
              onClick={() => setMenuOpen(false)}
            >
              Login or Register
            </Link>
          </div>
        </nav>
      </div>
      {menuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
