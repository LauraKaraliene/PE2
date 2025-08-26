import VenueCard from "../VenueCard";
import { CalendarDaysIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function BookedVenueCard({ booking }) {
  if (!booking || !booking.venue) return null;

  const { venue, dateFrom, dateTo, guests } = booking;

  function nights(from, to) {
    const d1 = new Date(from);
    const d2 = new Date(to);
    const ms = d2.setHours(12, 0, 0, 0) - d1.setHours(12, 0, 0, 0);
    return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
  }

  const n = nights(dateFrom, dateTo);
  const totalPrice = (Number(venue.price) || 0) * n;

  return (
    <VenueCard venue={venue} linkState={{ bookingId: booking.id }}>
      <div className="space-y-1 text-xs mb-2 text-gray-700">
        <div className="flex items-center gap-2 my-2">
          <CalendarDaysIcon className="w-4 h-4" />
          <span>
            {new Date(dateFrom).toLocaleDateString()} →{" "}
            {new Date(dateTo).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <UsersIcon className="w-4 h-4" />
          <span>Guests: {guests}</span>
        </div>

        <div className="flex items-center gap-2 font-semibold">
          <span>
            Total: {totalPrice} NOK / {n} night{n > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </VenueCard>
  );
}
