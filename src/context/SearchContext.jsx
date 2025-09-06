/**
 * Context for managing search functionality.
 *
 * - Handles search queries and fetches results from the API.
 * - Debounces API calls to optimize performance.
 * - Automatically navigates to the home page when a search query is made from another route.
 *
 * @module SearchContext
 */

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SearchContext = createContext();

/**
 * Provider component for the Search context.
 *
 * - Wraps the application and provides access to search-related functions and data.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render within the provider.
 * @returns {JSX.Element} The Search context provider.
 */
export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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
  }, [query]);

  return (
    <SearchContext.Provider value={{ query, setQuery, results, loading }}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * Hook to access the Search context.
 *
 * @returns {object} The Search context value.
 */
export const useSearch = () => useContext(SearchContext);
