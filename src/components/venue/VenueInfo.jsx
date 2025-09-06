/**
 * Venue information component.
 *
 * - Aggregates and displays detailed information about a venue.
 * - Uses subcomponents to display the venue's name, location, guest capacity, rating, amenities, and description.
 *
 * @param {object} props - Component props.
 * @param {object} props.venue - The venue data.
 * @param {string} props.venue.name - The name of the venue.
 * @param {string} props.venue.description - The description of the venue.
 * @param {number} props.venue.rating - The rating of the venue.
 * @param {number} props.venue.maxGuests - The maximum number of guests allowed at the venue.
 * @param {object} props.venue.location - The location data of the venue.
 * @param {string} props.venue.location.city - The city where the venue is located.
 * @param {string} props.venue.location.country - The country where the venue is located.
 * @param {object} props.venue.meta - Metadata about the venue's amenities.
 * @param {boolean} [props.venue.meta.wifi] - Indicates if the venue offers WiFi.
 * @param {boolean} [props.venue.meta.parking] - Indicates if the venue offers parking.
 * @param {boolean} [props.venue.meta.breakfast] - Indicates if the venue offers breakfast.
 * @param {boolean} [props.venue.meta.pets] - Indicates if the venue allows pets.
 * @param {string} [props.className=""] - Additional CSS classes for the component.
 * @returns {JSX.Element} The rendered venue information component.
 */

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
