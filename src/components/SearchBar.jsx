/**
 * Search bar component.
 *
 * - Provides an input field for searching destinations.
 * - Uses the `SearchContext` to manage the search query state.
 * - Includes a magnifying glass icon for visual indication.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className=""] - Additional CSS classes for the component.
 * @returns {JSX.Element} The rendered search bar component.
 */

import React from "react";
import { useSearch } from "../context/SearchContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

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
        className="w-full border-0 border-b border-[color:var(--color-background-gray)] focus:border-[color:var(--color-neutral)] focus:outline-none text-sm py-2 pr-10 bg-transparent"
      />
      <div className="absolute right-0 top-2.5 pointer-events-none">
        <MagnifyingGlassIcon className="w-5 h-5 text-[color:var(--color-neutral)]" />
      </div>
    </div>
  );
}
