import { Link } from "react-router-dom";
import Logo from "../assets/logo-new.svg";
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
          className="w-full pl-4 pr-10 py-2 rounded shadow border focus:outline-none"
        ></input>
        <img
          src={SearchIcon}
          alt="Search Icon"
          className="absolute right-3 top-2.5 h-5 w-5"
        ></img>
      </div>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2"
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
      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 bg-white border rounded shadow-md w-40 sm:hidden">
          <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
            Login
          </Link>
          <Link to="/register" className="block px-4 py-2 hover:bg-gray-100">
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
