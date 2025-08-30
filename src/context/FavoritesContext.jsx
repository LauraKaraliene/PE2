import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const FavoritesContext = createContext();

function getUserKey() {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name?.toLowerCase?.() || "guest";
  return `holidaze:favorites:${name}`;
}

export function FavoritesProvider({ children }) {
  const storageKey = getUserKey();

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  });

  // Persist on change and when user switches
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites, storageKey]);

  // If user changes (login/logout), reload correct bucket
  useEffect(() => {
    try {
      const fresh = JSON.parse(localStorage.getItem(storageKey)) || [];
      setFavorites(fresh);
    } catch {
      setFavorites([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Store a lightweight snapshot so Saved Venues can render without refetch
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

  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((v) => v.id !== id));
  }

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

export function useFavorites() {
  return useContext(FavoritesContext);
}
