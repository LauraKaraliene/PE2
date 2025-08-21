// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import ImageSlider from "../components/venue/ImageSlider";
// import VenueInfo from "../components/venue/VenueInfo";
// import BookingCard from "../components/venue/BookingCard";

// export default function SingleVenue() {
//   const { id } = useParams();
//   const [venue, setVenue] = useState(null);

//   useEffect(() => {
//     async function fetchVenue() {
//       try {
//         const res = await fetch(
//           `https://v2.api.noroff.dev/holidaze/venues/${id}`
//         );
//         const json = await res.json();
//         setVenue(json.data);
//       } catch (error) {
//         console.error("Error fetching venue:", error);
//       }
//     }

//     fetchVenue();
//   }, [id]);

//   if (!venue) return <div className="text-center py-10">Loading...</div>;

//   return (
//     <div className="max-w-[800px] mx-auto mb-8 px-4 py-8">
//       <ImageSlider images={venue.media} />
//       <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <VenueInfo venue={venue} className="lg:col-span-2" />
//         <BookingCard venue={venue} className="lg:col-span-1 mt-6 lg:mt-0" />
//       </div>
//     </div>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import ImageSlider from "../components/venue/ImageSlider";
import VenueInfo from "../components/venue/VenueInfo";
import BookingCard from "../components/venue/BookingCard";
import HostPanel from "../components/venue/HostPanel";
import { apiRequest } from "../constants/api";

export default function SingleVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const fetchVenue = useCallback(async () => {
    try {
      const json = await apiRequest(
        `/holidaze/venues/${id}?_owner=true&_bookings=true`
      );
      const v = json.data;
      setVenue(v);

      const user = JSON.parse(localStorage.getItem("user"));
      setIsOwner(
        !!(
          user &&
          v?.owner?.name &&
          user.name?.toLowerCase() === v.owner.name.toLowerCase()
        )
      );
    } catch (error) {
      console.error("Error fetching venue:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchVenue();
  }, [fetchVenue]);

  if (!venue) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-[800px] mx-auto mb-8 px-4 py-8">
      <ImageSlider images={venue.media} />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <VenueInfo venue={venue} className="lg:col-span-2" />
        {isOwner ? (
          <HostPanel
            venue={venue}
            className="lg:col-span-1 mt-6 lg:mt-0"
            onDeleted={() =>
              navigate(
                `/profile/${JSON.parse(localStorage.getItem("user")).name}`
              )
            }
            onChanged={fetchVenue}
          />
        ) : (
          <BookingCard venue={venue} className="lg:col-span-1 mt-6 lg:mt-0" />
        )}
      </div>
    </div>
  );
}
