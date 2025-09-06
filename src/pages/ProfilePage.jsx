import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { API_PROFILES } from "../constants/api";
import { apiRequest } from "../utils/http";
import { useNotify } from "../store/notifications";

import ProfileInfo from "../components/profile/ProfileInfo";
import Tabs from "../components/profile/Tabs";
import PreviousBookings from "../components/profile/previousBookingsTab/PreviousBookings";
import MyVenuesTab from "../components/profile/myVenuesTab/MyVenuesTab";
import UpcomingBookings from "../components/profile/upcomingBookingsTab/UpcomingBookings";
import FavoritesTab from "../components/profile/FavoritesTab/FavoritesTab";
import Loader from "../components/Loader";

const TAB_TO_SLUG = {
  "Upcoming Bookings": "upcoming",
  "Previous Bookings": "previous",
  "My Venues": "my-venues",
  Favorites: "favorites",
};
const SLUG_TO_TAB = Object.fromEntries(
  Object.entries(TAB_TO_SLUG).map(([k, v]) => [v, k])
);

export default function ProfilePage() {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSlug = (searchParams.get("tab") || "upcoming").toLowerCase();
  const initialTab = SLUG_TO_TAB[initialSlug] || "Upcoming Bookings";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  const notify = useNotify((s) => s.push);
  const erroredOnce = useRef(false);

  const fetchProfile = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("accessToken");

    if (!token || !user || username.toLowerCase() !== user.name.toLowerCase()) {
      setUnauthorized(true);
      return;
    }

    try {
      setLoading(true);
      const minDelay = new Promise((res) => setTimeout(res, 1000));

      const result = await apiRequest(
        `${API_PROFILES}/${user.name}?_bookings=true&_venues=true`
      );

      await minDelay;
      setProfile(result.data);
    } catch (e) {
      console.error("Failed to fetch profile:", e);
      if (!erroredOnce.current) {
        erroredOnce.current = true;
        notify({
          type: "error",
          message: e?.message || "Could not load profile.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [username, notify]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (unauthorized) {
      notify({
        type: "error",
        message: "You can only view your own profile. Please log in.",
      });
    }
  }, [unauthorized, notify]);

  useEffect(() => {
    const slug = (searchParams.get("tab") || "upcoming").toLowerCase();
    const nextTab = SLUG_TO_TAB[slug] || "Upcoming Bookings";
    setActiveTab(nextTab);
  }, [searchParams]);

  if (unauthorized) return <Navigate to="/unauthorized" />;

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader size={80} label="Loading profile…" />
      </div>
    );
  }

  const today = new Date().setHours(0, 0, 0, 0);
  const upcoming =
    profile.bookings?.filter(
      (b) => new Date(b.dateTo).setHours(0, 0, 0, 0) >= today
    ) || [];
  const previous =
    profile.bookings?.filter(
      (b) => new Date(b.dateTo).setHours(0, 0, 0, 0) < today
    ) || [];
  const createdVenues = profile.venues || [];
  const isManager = profile.venueManager === true;

  function handleTabChange(tab) {
    setActiveTab(tab);
    const slug = TAB_TO_SLUG[tab] || "upcoming";
    const next = new URLSearchParams(searchParams);
    next.set("tab", slug);
    setSearchParams(next, { replace: true });
  }

  return (
    <section className="max-w-4xl mx-auto px-4">
      <ProfileInfo profile={profile} onBecameManager={fetchProfile} />

      <Tabs
        tabs={[
          "Upcoming Bookings",
          "Previous Bookings",
          "My Venues",
          "Favorites",
        ]}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      <div className="mt-8">
        {activeTab === "Upcoming Bookings" && <UpcomingBookings />}
        {activeTab === "Previous Bookings" && (
          <PreviousBookings bookings={previous} />
        )}
        {activeTab === "My Venues" && (
          <MyVenuesTab
            venues={createdVenues}
            canCreate={isManager}
            onRefresh={fetchProfile}
          />
        )}
        {activeTab === "Favorites" && <FavoritesTab />}
      </div>
    </section>
  );
}
