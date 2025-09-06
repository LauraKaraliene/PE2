/**
 * Venue card component.
 *
 * - Displays a venue's details, including its image, name, location, price, and rating.
 * - Allows users to add or remove the venue from their favorites.
 * - Supports additional content via the `children` prop.
 *
 * @param {object} props - Component props.
 * @param {object} props.venue - The venue data.
 * @param {string} props.venue.id - The unique ID of the venue.
 * @param {string} props.venue.name - The name of the venue.
 * @param {number} props.venue.price - The price per night for the venue.
 * @param {number} [props.venue.rating] - The rating of the venue.
 * @param {object} props.venue.location - The location data of the venue.
 * @param {string} props.venue.location.city - The city where the venue is located.
 * @param {string} props.venue.location.country - The country where the venue is located.
 * @param {Array} [props.venue.media] - An array of media objects for the venue.
 * @param {string} [props.venue.media[].url] - The URL of the venue's image.
 * @param {string} [props.venue.media[].alt] - The alt text for the venue's image.
 * @param {React.ReactNode} [props.children] - Additional content to display in the card.
 * @param {string} [props.to] - The URL to navigate to when the card is clicked.
 * @param {object} [props.linkState] - State to pass to the `Link` component.
 * @returns {JSX.Element} The rendered venue card component.
 */

import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder.png";
import { StarIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useFavorites } from "../context/FavoritesContext";
import { useNotify } from "./store/notifications";

export default function VenueCard({ venue, children, to, linkState }) {
  const { id, name, price, rating, location, media } = venue || {};
  const imageUrl = media?.[0]?.url || placeholder;
  const imageAlt = media?.[0]?.alt || "Venue image";
  const city = location?.city || "Unknown city";
  const country = location?.country || "Unknown country";

  const { isFavorite, toggleFavorite } = useFavorites();
  const notify = useNotify((s) => s.push);

  const fav = isFavorite(id);
  const href = to ?? `/venues/${id}`;
  const hasRating = typeof rating === "number" && rating > 0;

  function handleToggleFav(e) {
    e.preventDefault();
    e.stopPropagation();

    toggleFavorite(venue);

    // Success toast
    notify({
      type: "success",
      message: fav ? "Removed from favorites" : "Added to favorites",
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isGuest = !user?.name;
    if (isGuest && !sessionStorage.getItem("favGuestHintShown")) {
      sessionStorage.setItem("favGuestHintShown", "1");
      notify({
        type: "info",
        message: "Favorites are saved for this browser only until you log in.",
      });
    }
  }

  return (
    <Link to={href} state={linkState} className="block group">
      <div
        className="
          w-full h-full rounded-lg overflow-hidden shadow-md relative bg-[color:var(--color-background)] flex flex-col
          transition-transform duration-200 ease-out transform-gpu
          hover:-translate-y-1 hover:shadow-xl
          focus-within:-translate-y-1 focus-within:shadow-lg
          motion-reduce:transform-none motion-reduce:transition-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2
        "
      >
        {/* Image */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-52 object-cover"
          />
          <button
            type="button"
            onClick={handleToggleFav}
            className="absolute top-2 right-2 cursor-pointer z-10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            {fav ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartOutline className="w-5 h-5 text-[color:var(--color-background)] drop-shadow" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col gap-1 mb-1">
          <h3 className="font-semibold text-sm py-2">
            {city}, {country}
          </h3>

          <p
            className="text-sm mb-2 text-[color:var(--color-neutral)]"
            title={name}
          >
            {name}
          </p>

          {/* Bottom row pinned */}
          <div className="mt-auto flex justify-between items-center text-sm font-semibold leading-none">
            <span className="leading-none text-[color:var(--color-neutral)]">
              {price} NOK{" "}
              <span className="text-gray-400 font-normal">/night</span>
            </span>

            {hasRating && (
              <span className="inline-flex items-center gap-1 leading-none h-4">
                <StarIcon
                  className="w-4 h-4 text-[color:var(--color-secondary)] shrink-0 -mt-px"
                  aria-hidden="true"
                />
                <span className="leading-none text-[color:var(--color-neutral)]">
                  {Number(rating).toFixed(1)}
                </span>
              </span>
            )}
          </div>

          {children && (
            <div className="pt-2 mt-2 border-t border-[color:var(--color-background-gray)] text-xs text-[color:var(--color-neutral)]">
              {children}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
