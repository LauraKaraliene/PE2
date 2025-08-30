import { useEffect, useMemo, useState, useCallback } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { apiRequest } from "../constants/api";
import ImageSlider from "../components/venue/ImageSlider";
import VenueInfo from "../components/venue/VenueInfo";
import BookingPanel from "../components/venue/BookingPanel";
import HostPanel from "../components/venue/HostPanel";
import ManageBookingPanel from "../components/venue/ManageBookingPanel";
import HostBadge from "../components/venue/HostBadge";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function SingleVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [venue, setVenue] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  // Page to return to (prefer state.fromPage, else ?page=, else null)
  const fromPage = useMemo(() => {
    const statePage = location.state?.fromPage;
    if (statePage) return Number(statePage);
    const qp = searchParams.get("page");
    return qp ? Number(qp) : null;
  }, [location.state, searchParams]);

  const bookingIdFromState = location.state?.bookingId || null;

  const fetchVenue = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest(
        `/holidaze/venues/${id}?_owner=true&_bookings=true`
      );
      const v = res?.data;
      if (!v) throw new Error("Venue not found");
      setVenue(v);

      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;

      const ownerName = (v?.owner?.name || "").toLowerCase();
      const currentName = (user?.name || "").toLowerCase();

      setIsOwner(Boolean(ownerName) && ownerName === currentName);
    } catch (err) {
      console.error("Error fetching venue:", err);
      // Optional: send to a Not Found route if you have one
      // navigate("/not-found", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVenue();
    // Optional: scroll to top when opening a venue
    window.scrollTo(0, 0);
  }, [fetchVenue]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!venue) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <p className="mb-6">This venue could not be found.</p>
        <button
          onClick={() => {
            if (fromPage) navigate(`/?page=${fromPage}`, { replace: true });
            else if (window.history.length > 1) navigate(-1);
            else navigate("/");
          }}
          className="inline-flex items-center gap-2 text-sm underline hover:no-underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const showManagePanel = !isOwner && !!bookingIdFromState;

  return (
    <div className="max-w-[800px] mx-auto mb-8 px-4 pt-0 pb-8">
      {/* Back */}
      <button
        onClick={() => {
          if (fromPage) navigate(`/?page=${fromPage}`, { replace: true });
          else if (window.history.length > 1) navigate(-1);
          else navigate("/");
        }}
        className="inline-flex items-center gap-2 text-xs text-gray-500 hover:underline  underline-offset-4 cursor-pointer"
        aria-label="Back to list"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </button>

      <div className="mt-4">
        <ImageSlider images={venue.media} />
      </div>

      <div className="mt-8 flex flex-col lg:flex-row lg:gap-8 gap-6">
        <div className="flex-1">
          <VenueInfo venue={venue} />
          {!isOwner && <HostBadge owner={venue.owner} />}
        </div>

        <aside className="flex-shrink-0 w-full max-w-sm">
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
        </aside>
      </div>
    </div>
  );
}

// import { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";

// import { apiRequest } from "../constants/api";
// import ImageSlider from "../components/venue/ImageSlider";
// import VenueInfo from "../components/venue/VenueInfo";
// import BookingPanel from "../components/venue/BookingPanel";
// import HostPanel from "../components/venue/HostPanel";
// import ManageBookingPanel from "../components/venue/ManageBookingPanel";
// import HostBadge from "../components/venue/HostBadge";

// export default function SingleVenue() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [venue, setVenue] = useState(null);
//   const [isOwner, setIsOwner] = useState(false);

//   const bookingIdFromState = location.state?.bookingId || null;

//   const fetchVenue = useCallback(async () => {
//     try {
//       const res = await apiRequest(
//         `/holidaze/venues/${id}?_owner=true&_bookings=true`
//       );
//       const v = res?.data;
//       setVenue(v);

//       const userRaw = localStorage.getItem("user");
//       const user = userRaw ? JSON.parse(userRaw) : null;

//       const ownerName = v?.owner?.name || "";
//       const currentName = user?.name || "";
//       setIsOwner(
//         !!ownerName &&
//           !!currentName &&
//           currentName.toLowerCase() === ownerName.toLowerCase()
//       );
//     } catch (err) {
//       console.error("Error fetching venue:", err);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchVenue();
//   }, [fetchVenue]);

//   if (!venue) {
//     return <div className="text-center py-10">Loading...</div>;
//   }

//   // Decide which side panel to show
//   const showManagePanel = !isOwner && !!bookingIdFromState;

//   return (
//     <div className="max-w-[800px] mx-auto mb-8 px-4 py-8">
//       <ImageSlider images={venue.media} />

//       <div className="mt-8 flex flex-col lg:flex-row lg:gap-8 gap-6">
//         <div className="flex-1">
//           <VenueInfo venue={venue} />
//           {!isOwner && <HostBadge owner={venue.owner} />}
//         </div>

//         <div className="flex-shrink-0 w-full max-w-sm">
//           {isOwner ? (
//             <HostPanel
//               venue={venue}
//               onDeleted={() => {
//                 const me = JSON.parse(localStorage.getItem("user") || "{}");
//                 navigate(`/profile/${me?.name || ""}`);
//               }}
//               onChanged={fetchVenue}
//             />
//           ) : showManagePanel ? (
//             <ManageBookingPanel
//               venue={venue}
//               bookingId={bookingIdFromState}
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
