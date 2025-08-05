import VenueCard from "../VenueCard";

// temporar skeleton

export default function BookingCard({ booking }) {
  if (!booking || !booking.venue) return null;

  const { venue, dateFrom, dateTo, guests } = booking;
  const nights =
    (new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24);
  const totalPrice = venue.price * nights;

  return (
    <VenueCard venue={booking.venue}>
      <p>
        📅 {booking.dateFrom} → {booking.dateTo}
      </p>
      <p>👤 Guests: {booking.guests}</p>
      <p>💰 Total: {totalPrice} NOK</p>
    </VenueCard>
  );
}
