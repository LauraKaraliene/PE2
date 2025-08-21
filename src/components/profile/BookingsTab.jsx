import BookingCard from "./BookedCard";

export default function BookingsTab({ bookings = [] }) {
  if (!bookings.length)
    return <p className="text-sm text-gray-600">Nothing here yet...</p>;
  return (
    <div className="space-y-3 mb-6">
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
}
