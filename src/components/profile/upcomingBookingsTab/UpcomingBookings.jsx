// src/components/profile/UpcomingBookings.jsx
import { useEffect, useState } from "react";
import { getMyBookings, deleteBooking } from "../../bookings/CreateBooking";
import BookedVenueCard from "../BookedVenueCard";

export default function UpcomingBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await getMyBookings();
      // API shape: { data: [ { id, dateFrom, dateTo, guests, venue } ] }
      const all = res?.data || [];
      // Only future or ongoing
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

  async function onCancel(bookingId) {
    if (!confirm("Cancel this booking?")) return;
    try {
      await deleteBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (e) {
      alert("Could not cancel booking.");
    }
  }

  if (loading) return <div className="py-6 text-sm">Loading bookings…</div>;
  if (!bookings.length)
    return <div className="py-6 text-sm">No upcoming bookings yet.</div>;

  return (
    <div className="flex flex-wrap gap-4 mb-30">
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
