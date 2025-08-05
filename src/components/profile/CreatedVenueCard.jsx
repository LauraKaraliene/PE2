import VenueCard from "../VenueCard";

export default function CreatedVenueCard({ venue }) {
  if (!venue) return null;

  //   temporar card skeleton
  return (
    <VenueCard venue={venue}>
      <p className="text-sm text-gray-600">
        🏙️ Location: {venue.location?.address}, {venue.location?.city},{" "}
        {venue.location?.country}
      </p>
      <p className="text-sm text-gray-600">
        💰 Price: {venue.price} NOK / night
      </p>
      <p className="text-sm text-gray-600">🛏️ Max Guests: {venue.maxGuests}</p>
    </VenueCard>
  );
}
