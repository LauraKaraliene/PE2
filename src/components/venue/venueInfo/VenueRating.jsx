/**
 * Venue rating component.
 *
 * - Displays the venue's rating as a star icon and a numeric value.
 * - If no rating is available, optionally displays a placeholder message.
 *
 * @param {object} props - Component props.
 * @param {number} [props.rating] - The numeric rating of the venue (e.g., 4.5).
 * @param {boolean} [props.showPlaceholder=false] - Whether to display a placeholder message if no rating is available.
 * @returns {JSX.Element|null} The rendered venue rating component, or `null` if no rating and `showPlaceholder` is `false`.
 */

import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

export default function VenueRating({ rating, showPlaceholder = false }) {
  const hasRating = typeof rating === "number" && rating > 0;

  if (!hasRating && !showPlaceholder) return null;

  return hasRating ? (
    <div className="inline-flex items-center gap-2 text-sm text-[color:var(--color-neutral)] leading-none">
      <StarSolid
        className="w-4 h-4 text-[color:var(--color-secondary)] shrink-0"
        aria-hidden="true"
      />
      <span className="leading-none">{rating}</span>
    </div>
  ) : (
    <div className="inline-flex items-center gap-2 text-sm text-[color:var(--color-background-gray)] leading-none">
      <StarOutline
        className="w-4 h-4 text-[color:var(--color-background-gray)] shrink-0"
        aria-hidden="true"
      />
      <span className="leading-none">No reviews yet</span>
    </div>
  );
}
