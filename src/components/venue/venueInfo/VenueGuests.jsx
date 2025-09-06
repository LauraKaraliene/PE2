/**
 * Venue guests component.
 *
 * - Displays the maximum number of guests a venue can accommodate.
 *
 * @param {object} props - Component props.
 * @param {number} props.maxGuests - The maximum number of guests allowed at the venue.
 * @returns {JSX.Element} The rendered venue guests component.
 */

import { UsersIcon } from "@heroicons/react/24/outline";

export default function VenueGuests({ maxGuests }) {
  return (
    <div className="flex items-center gap-2 mb-2 text-sm text-[color:var(--color-neutral)]">
      <UsersIcon className="w-4 h-4 text-gray-700" />
      <span>{maxGuests} guests</span>
    </div>
  );
}
