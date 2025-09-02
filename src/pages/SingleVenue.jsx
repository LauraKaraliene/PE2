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
import Loader from "../components/Loader";

export default function SingleVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [venue, setVenue] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  // Determine which page to go back to
  const fromPage = useMemo(() => {
    const statePage = location.state?.fromPage;
    if (statePage) return Number(statePage);
    const qp = searchParams.get("page");
    return qp ? Number(qp) : null;
  }, [location.state, searchParams]);

  const bookingIdFromState = location.state?.bookingId || null;

  const fetchVenue = useCallback(async () => {
    let isMounted = true;
    setLoading(true);

    try {
      // 2s loader
      const minDelay = new Promise((res) => setTimeout(res, 1000));

      const res = await apiRequest(
        `/holidaze/venues/${id}?_owner=true&_bookings=true`
      );
      const v = res?.data;
      if (!v) throw new Error("Venue not found");

      await minDelay;
      if (!isMounted) return;

      setVenue(v);

      // Check ownership
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      const ownerName = (v?.owner?.name || "").toLowerCase();
      const currentName = (user?.name || "").toLowerCase();
      setIsOwner(Boolean(ownerName) && ownerName === currentName);
    } catch (err) {
      console.error("Error fetching venue:", err);
      if (isMounted) setVenue(null);
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    const cleanup = fetchVenue();
    window.scrollTo(0, 0);
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [fetchVenue]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader size={80} label="Loading venue…" />
      </div>
    );
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
        className="inline-flex items-center gap-2 text-xs text-gray-500 hover:underline underline-offset-4 cursor-pointer"
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
