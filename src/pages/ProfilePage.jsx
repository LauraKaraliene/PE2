import { useEffect, useState, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { API_PROFILES, apiRequest } from "../constants/api";
import ProfileInfo from "../components/profile/ProfileInfo";
import Tabs from "../components/profile/Tabs";
import BookingsTab from "../components/profile/BookingsTab";
import MyVenuesTab from "../components/profile/MyVenuesTab";

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("Upcoming Bookings");

  const fetchProfile = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("accessToken");
    if (!token || !user || username.toLowerCase() !== user.name.toLowerCase()) {
      setUnauthorized(true);
      return;
    }
    try {
      const result = await apiRequest(
        `${API_PROFILES}/${user.name}?_bookings=true&_venues=true`
      );
      setProfile(result.data);
    } catch (e) {
      console.error("Failed to fetch profile:", e);
    }
  }, [username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (unauthorized) return <Navigate to="/unauthorized" />;
  if (!profile) return <div>Loading profile...</div>;

  const now = new Date();
  const upcoming =
    profile.bookings?.filter((b) => new Date(b.dateFrom) >= now) || [];
  const previous =
    profile.bookings?.filter((b) => new Date(b.dateFrom) < now) || [];
  const createdVenues = profile.venues || [];
  const isManager = profile.venueManager === true;

  return (
    <section className="max-w-4xl mx-auto px-4">
      <ProfileInfo profile={profile} />
      <Tabs
        tabs={["Upcoming Bookings", "Previous Bookings", "My Venues"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="mt-8">
        {activeTab === "Upcoming Bookings" && (
          <BookingsTab bookings={upcoming} />
        )}
        {activeTab === "Previous Bookings" && (
          <BookingsTab bookings={previous} />
        )}
        {activeTab === "My Venues" && (
          <MyVenuesTab
            venues={createdVenues}
            canCreate={isManager}
            onRefresh={fetchProfile}
          />
        )}
      </div>
    </section>
  );
}
