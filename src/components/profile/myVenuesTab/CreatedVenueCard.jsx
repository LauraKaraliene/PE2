/**
 * Created venue card component.
 *
 * - Displays a venue's image, name, location, and price.
 * - Provides a link to the venue's detailed page.
 * - Handles missing data gracefully by using placeholders for images and location.
 *
 * @param {object} props - Component props.
 * @param {object} props.venue - The venue data to display.
 * @param {string} props.venue.id - The ID of the venue.
 * @param {string} props.venue.name - The name of the venue.
 * @param {number} props.venue.price - The price per night for the venue.
 * @param {object} props.venue.location - The location of the venue.
 * @param {string} [props.venue.location.city] - The city where the venue is located.
 * @param {string} [props.venue.location.country] - The country where the venue is located.
 * @param {Array} props.venue.media - An array of media objects for the venue.
 * @param {string} [props.venue.media[].url] - The URL of the venue's image.
 * @param {string} [props.venue.media[].alt] - The alt text for the venue's image.
 * @returns {JSX.Element|null} The rendered venue card, or `null` if no venue data is provided.
 */

import { Link } from "react-router-dom";
import placeholder from "../../../assets/placeholder.png";

export default function CreatedVenueCard({ venue }) {
  if (!venue) return null;

  const { id, name, price, location, media } = venue;
  const imageUrl = media?.[0]?.url || placeholder;
  const imageAlt = media?.[0]?.alt || "Venue image";
  const city = location?.city || "Unknown city";
  const country = location?.country || "Unknown country";

  return (
    <Link
      to={`/venues/${id}`}
      className="block focus:outline-none hover:shadow-lg transition-shadow duration-200"
    >
      <article className="w-full h-full rounded-lg overflow-hidden shadow-md relative bg-[color:var(--color-background)] flex flex-col">
        {/* Image */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-52 object-cover"
          />
        </div>

        {/* Text */}
        <div className="p-3 space-y-1">
          <h3 className="font-heading font-semibold text-sm py-2 text-[color:var(--color-neutral)]">
            {city}, {country}
          </h3>

          <p
            className="text-sm text-[color:var(--color-neutral)] truncate"
            title={name}
          >
            {name}
          </p>

          <div className="text-sm font-semibold text-[color:var(--color-primary)]">
            {price} NOK{" "}
            <span className="text-[color:var(--color-neutral)] font-normal">
              /night
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
