import React from "react";
import { useSearch } from "../context/SearchContext";

export default function SearchBar({ className = "" }) {
  const { query, setQuery } = useSearch();

  return (
    <div
      className={`relative w-full max-w-xs mx-auto mt-4 sm:mt-0 sm:mx-0 ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search destinations"
        className="w-full border-0 border-b border-gray-400 focus:border-black focus:outline-none text-sm py-2 pr-10 bg-transparent"
      />

      {/* Magnifying glass icon (positioned in top right of input) */}
      <div className="absolute right-0 top-2.5 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 text-black"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
    </div>
  );
}
