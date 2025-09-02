import BookedVenueCard from "../BookedVenueCard";

export default function PreviousBookings({ bookings = [] }) {
  if (!bookings.length) {
    return <p className="text-sm py-6">No previous bookings yet...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((b) => (
        <BookedVenueCard key={b.id} booking={b} />
      ))}
    </div>
  );
}
