import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SearchContext = createContext();

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

export const useSearch = () => useContext(SearchContext);
