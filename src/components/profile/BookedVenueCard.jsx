/**
 * Booked venue card component.
 *
 * - Displays detailed information about a booking, including venue details, dates, guests, and total price.
 * - Wraps the venue details in a `VenueCard` component.
 * - Calculates the total price based on the number of nights and the venue's price per night.
 *
 * @param {object} props - Component props.
 * @param {object} props.booking - The booking data to display.
 * @param {object} props.booking.venue - The venue associated with the booking.
 * @param {string} props.booking.dateFrom - The start date of the booking.
 * @param {string} props.booking.dateTo - The end date of the booking.
 * @param {number} props.booking.guests - The number of guests for the booking.
 * @returns {JSX.Element|null} The rendered booked venue card, or `null` if no booking or venue data is provided.
 */

import VenueCard from "../VenueCard";
import { CalendarDaysIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function BookedVenueCard({ booking }) {
  if (!booking || !booking.venue) return null;

  const { venue, dateFrom, dateTo, guests } = booking;

  /**
   * Calculates the number of nights between two dates.
   *
   * @param {string|Date} from - The start date.
   * @param {string|Date} to - The end date.
   * @returns {number} The number of nights.
   */
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
      <div className="space-y-1 text-xs mb-2 text-[color:var(--color-neutral)]">
        <div className="flex items-center gap-2 my-2">
          <CalendarDaysIcon className="w-5 h-5 text-[color:var(--color-primary)]" />
          <span>
            {new Date(dateFrom).toLocaleDateString()} →{" "}
            {new Date(dateTo).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <UsersIcon className="w-5 h-5 text-[color:var(--color-primary)]" />
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
