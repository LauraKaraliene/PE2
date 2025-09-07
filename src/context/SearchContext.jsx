/**
 * Search context and provider.
 *
 * - Manages the global search state, including the query, results, and loading status.
 * - Provides functionality to perform a search and clear results when navigating away from the home page.
 * - Includes a `useSearch` hook for accessing the search state and actions.
 */

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SearchContext = createContext();

/**
 * SearchProvider component.
 *
 * - Wraps the application or specific parts of it to provide search functionality.
 * - Manages the search query, results, and loading state.
 * - Automatically clears the search when navigating away from the home page.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the search context.
 * @returns {JSX.Element} The search context provider.
 */
export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Clear search when navigating away from home page
  useEffect(() => {
    if (location.pathname !== "/" && query.trim()) {
      setQuery("");
      setResults([]);
    }
  }, [location.pathname]);

  // Search functionality
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      if (location.pathname !== "/") {
        navigate("/");
      }

      setLoading(true);
      fetch(`https://v2.api.noroff.dev/holidaze/venues/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.data);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, navigate, location.pathname]);

  return (
    <SearchContext.Provider value={{ query, setQuery, results, loading }}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * Custom hook to access the search context.
 *
 * - Provides access to the search query, results, loading state, and actions.
 *
 * @returns {object} The search context value, including:
 * - `query` (string): The current search query.
 * - `setQuery` (function): Function to update the search query.
 * - `results` (Array): The search results.
 * - `loading` (boolean): Whether the search is currently loading.
 */
export const useSearch = () => useContext(SearchContext);
