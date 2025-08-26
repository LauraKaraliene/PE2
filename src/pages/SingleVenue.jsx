import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import ImageSlider from "../components/venue/ImageSlider";
import VenueInfo from "../components/venue/VenueInfo";
import BookingPanel from "../components/venue/BookingPanel";
import HostPanel from "../components/venue/HostPanel";
import ManageBookingPanel from "../components/venue/ManageBookingPanel";
import { apiRequest } from "../constants/api";

export default function SingleVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [venue, setVenue] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const bookingIdFromState = location.state?.bookingId || null;

  const fetchVenue = useCallback(async () => {
    try {
      const res = await apiRequest(
        `/holidaze/venues/${id}?_owner=true&_bookings=true`
      );
      const v = res?.data;
      setVenue(v);

      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;

      const ownerName = v?.owner?.name || "";
      const currentName = user?.name || "";
      setIsOwner(
        !!ownerName &&
          !!currentName &&
          currentName.toLowerCase() === ownerName.toLowerCase()
      );
    } catch (err) {
      console.error("Error fetching venue:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchVenue();
  }, [fetchVenue]);

  if (!venue) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Decide which side panel to show
  const showManagePanel = !isOwner && !!bookingIdFromState;

  return (
    <div className="max-w-[800px] mx-auto mb-8 px-4 py-8">
      <ImageSlider images={venue.media} />

      <div className="mt-8 flex flex-col lg:flex-row lg:gap-8 gap-6">
        <div className="flex-1">
          <VenueInfo venue={venue} />
        </div>

        <div className="flex-shrink-0 w-full max-w-sm">
          {isOwner ? (
            <HostPanel
              venue={venue}
              onDeleted={() => {
                const me = JSON.parse(localStorage.getItem("user") || "{}");
                navigate(`/profile/${me?.name || ""}`);
              }}
              onChanged={fetchVenue}
            />
          ) : showManagePanel ? (
            <ManageBookingPanel
              venue={venue}
              bookingId={bookingIdFromState}
              onChanged={fetchVenue}
            />
          ) : (
            <BookingPanel venue={venue} />
          )}
        </div>
      </div>
    </div>
  );
}

// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState, useCallback } from "react";
// import ImageSlider from "../components/venue/ImageSlider";
// import VenueInfo from "../components/venue/VenueInfo";
// import BookingPanel from "../components/venue/BookingPanel";
// import HostPanel from "../components/venue/HostPanel";
// import { apiRequest } from "../constants/api";

// export default function SingleVenue() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [venue, setVenue] = useState(null);
//   const [isOwner, setIsOwner] = useState(false);

//   const fetchVenue = useCallback(async () => {
//     try {
//       const json = await apiRequest(
//         `/holidaze/venues/${id}?_owner=true&_bookings=true`
//       );
//       const v = json.data;
//       setVenue(v);

//       const user = JSON.parse(localStorage.getItem("user"));
//       setIsOwner(
//         !!(
//           user &&
//           v?.owner?.name &&
//           user.name?.toLowerCase() === v.owner.name.toLowerCase()
//         )
//       );
//     } catch (error) {
//       console.error("Error fetching venue:", error);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchVenue();
//   }, [fetchVenue]);

//   if (!venue) return <div className="text-center py-10">Loading...</div>;

//   return (
//     <div className="max-w-[800px] mx-auto mb-8 px-4 py-8">
//       <ImageSlider images={venue.media} />
//       <div className="mt-8 flex flex-col lg:flex-row lg:gap-8 gap-6">
//         <div className="flex-1">
//           <VenueInfo venue={venue} />
//         </div>
//         <div className="flex-shrink-0 w-full max-w-sm">
//           {isOwner ? (
//             <HostPanel
//               venue={venue}
//               onDeleted={() =>
//                 navigate(
//                   `/profile/${JSON.parse(localStorage.getItem("user")).name}`
//                 )
//               }
//               onChanged={fetchVenue}
//             />
//           ) : (
//             <BookingPanel venue={venue} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
