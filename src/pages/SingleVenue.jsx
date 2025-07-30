import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageSlider from "../components/venue/ImageSlider";
import VenueInfo from "../components/venue/VenueInfo";
import BookingCard from "../components/venue/BookingCard";

export default function SingleVenue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`
        );
        const json = await res.json();
        setVenue(json.data);
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    }

    fetchVenue();
  }, [id]);

  if (!venue) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-[800px] mx-auto mb-8 px-4 py-8">
      <ImageSlider images={venue.media} />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <VenueInfo venue={venue} className="lg:col-span-2" />
        <BookingCard venue={venue} className="lg:col-span-1" />
      </div>
    </div>
  );
}
