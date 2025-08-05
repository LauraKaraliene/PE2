import VenueName from "./venueInfo/VenueName";
import VenueLocation from "./venueInfo/VenueLocation";
import VenueGuests from "./venueInfo/VenueGuests";
import VenueRating from "./venueInfo/VenueRating";
import VenueAmenities from "./venueInfo/VenueAmenities";
import VenueDescription from "./venueInfo/VenueDescription";

export default function VenueInfo({ venue, className = "" }) {
  const { name, description, rating, maxGuests, location, meta } = venue;

  return (
    <div className={className}>
      <VenueName name={name} />
      <VenueLocation location={location} />
      <VenueGuests maxGuests={maxGuests} />
      <VenueRating rating={rating} />
      <VenueAmenities meta={meta} />
      <VenueDescription description={description} />
    </div>
  );
}
