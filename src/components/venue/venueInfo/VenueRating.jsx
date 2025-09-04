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
