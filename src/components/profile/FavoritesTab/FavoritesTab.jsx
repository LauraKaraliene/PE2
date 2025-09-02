import VenueCard from "../../VenueCard";
import { useFavorites } from "../../../context/FavoritesContext";

export default function FavoritesTab() {
  const { favorites } = useFavorites();

  if (!favorites.length) {
    return <p className="text-sm py-6">No saved favorites yet...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((v) => (
        <VenueCard key={v.id} venue={v} />
      ))}
    </div>
  );
}
