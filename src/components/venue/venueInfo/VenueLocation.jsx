/**
 * Venue location component.
 *
 * - Displays the city and country of a venue.
 *
 * @param {object} props - Component props.
 * @param {object} props.location - The location data of the venue.
 * @param {string} props.location.city - The city where the venue is located.
 * @param {string} props.location.country - The country where the venue is located.
 * @returns {JSX.Element} The rendered venue location component.
 */

import { MapPinIcon } from "@heroicons/react/24/outline";

export default function VenueLocation({ location }) {
  return (
    <p className="flex items-center gap-1 text-sm text-[color:var(--color-neutral)] mb-2">
      <MapPinIcon className="w-4 h-4 text-gray-700" />
      {location.city}, {location.country}
    </p>
  );
}
