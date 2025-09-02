import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder.png";
import { StarIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useFavorites } from "../context/FavoritesContext";

export default function VenueCard({ venue, children, to, linkState }) {
  const { id, name, price, rating, location, media } = venue || {};
  const imageUrl = media?.[0]?.url || placeholder;
  const imageAlt = media?.[0]?.alt || "Venue image";
  const city = location?.city || "Unknown city";
  const country = location?.country || "Unknown country";

  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(id);
  const href = to ?? `/venues/${id}`;
  const hasRating = typeof rating === "number" && rating > 0;

  return (
    <Link to={href} state={linkState} className="block group">
      <div
        className="
          w-full h-full rounded-lg overflow-hidden shadow-md relative bg-white flex flex-col
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
            className="w-full h-52 object-cover "
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(venue);
            }}
            className="absolute top-2 right-2 cursor-pointer z-10 rounded-full w-8 h-8 flex items-center justify-center"
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            {fav ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartOutline className="w-5 h-5 text-white drop-shadow" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col gap-1">
          <h3 className="font-semibold text-sm py-2">
            {city}, {country}
          </h3>

          <p className="text-sm text-gray-700" title={name}>
            {name}
          </p>

          {/* Bottom row pinned */}
          <div className="mt-auto flex justify-between items-center text-sm font-semibold leading-none">
            <span className="leading-none">
              {price} NOK{" "}
              <span className="text-gray-500 font-normal">/night</span>
            </span>

            {hasRating && (
              <span className="inline-flex items-center gap-1 leading-none h-4">
                <StarIcon
                  className="w-4 h-4 text-yellow-500 shrink-0 -mt-px"
                  aria-hidden="true"
                />
                <span className="leading-none">
                  {Number(rating).toFixed(1)}
                </span>
              </span>
            )}
          </div>

          {children && (
            <div className="pt-2 mt-2 border-t border-gray-300 text-xs text-gray-700">
              {children}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
