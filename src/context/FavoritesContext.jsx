/**
 * Context for managing user favorites.
 *
 * - Stores and retrieves favorites from `localStorage` based on the logged-in user.
 * - Provides functions to add, remove, toggle, and check if a venue is a favorite.
 * - Automatically updates `localStorage` when favorites change.
 *
 * @module FavoritesContext
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const FavoritesContext = createContext();

/**
 * Generates a unique storage key for the current user.
 *
 * @returns {string} The storage key for the user's favorites.
 */
function getUserKey() {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name?.toLowerCase?.() || "guest";
  return `holidaze:favorites:${name}`;
}

/**
 * Provider component for the Favorites context.
 *
 * - Wraps the application and provides access to favorites-related functions and data.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render within the provider.
 * @returns {JSX.Element} The Favorites context provider.
 */
export function FavoritesProvider({ children }) {
  const storageKey = getUserKey();

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites, storageKey]);

  useEffect(() => {
    try {
      const fresh = JSON.parse(localStorage.getItem(storageKey)) || [];
      setFavorites(fresh);
    } catch {
      setFavorites([]);
    }
  }, [storageKey]);

  /**
   * Adds a venue to the favorites list.
   *
   * @param {object} venue - The venue to add.
   */
  function addFavorite(venue) {
    const snap = {
      id: venue.id,
      name: venue.name,
      price: venue.price,
      rating: venue.rating,
      location: venue.location,
      media: venue.media,
    };
    setFavorites((prev) =>
      prev.some((v) => v.id === snap.id) ? prev : [...prev, snap]
    );
  }

  /**
   * Removes a venue from the favorites list.
   *
   * @param {string} id - The ID of the venue to remove.
   */
  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((v) => v.id !== id));
  }

  /**
   * Toggles a venue's favorite status.
   *
   * @param {object} venue - The venue to toggle.
   */
  function toggleFavorite(venue) {
    setFavorites((prev) => {
      const exists = prev.some((v) => v.id === venue.id);
      if (exists) return prev.filter((v) => v.id !== venue.id);
      const snap = {
        id: venue.id,
        name: venue.name,
        price: venue.price,
        rating: venue.rating,
        location: venue.location,
        media: venue.media,
      };
      return [...prev, snap];
    });
  }

  /**
   * Checks if a venue is in the favorites list.
   *
   * @param {string} id - The ID of the venue to check.
   * @returns {boolean} `true` if the venue is a favorite, otherwise `false`.
   */
  const isFavorite = (id) => favorites.some((v) => v.id === id);

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
    }),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Hook to access the Favorites context.
 *
 * @returns {object} The Favorites context value.
 */
export function useFavorites() {
  return useContext(FavoritesContext);
}
