/**
 * Upcoming bookings tab component.
 *
 * - Fetches and displays the user's upcoming bookings.
 * - Filters bookings to show only those with end dates in the future.
 * - Allows users to cancel bookings with a confirmation prompt.
 *
 * @returns {JSX.Element} The rendered upcoming bookings tab.
 */

import { useEffect, useState } from "react";
import { getMyBookings, deleteBooking } from "../../bookings/CreateBooking";
import BookedVenueCard from "../BookedVenueCard";

export default function UpcomingBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Loads the user's bookings and filters for upcoming bookings.
   */
  async function load() {
    try {
      setLoading(true);
      const res = await getMyBookings();
      const all = res?.data || [];
      const now = new Date().setHours(0, 0, 0, 0);
      const upcoming = all
        .filter((b) => new Date(b.dateTo).setHours(0, 0, 0, 0) >= now)
        .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
      setBookings(upcoming);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /**
   * Cancels a booking.
   *
   * - Prompts the user for confirmation before canceling.
   * - Removes the canceled booking from the list of upcoming bookings.
   *
   * @param {string} bookingId - The ID of the booking to cancel.
   */
  async function onCancel(bookingId) {
    if (!confirm("Cancel this booking?")) return;
    try {
      await deleteBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (e) {
      alert("Could not cancel booking.");
    }
  }

  if (!bookings.length)
    return <div className="py-6 text-sm">No upcoming bookings yet...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((b) => (
        <BookedVenueCard
          key={b.id}
          booking={b}
          onCancel={() => onCancel(b.id)}
        />
      ))}
    </div>
  );
}
