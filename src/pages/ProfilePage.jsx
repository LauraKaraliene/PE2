import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { API_PROFILES, apiRequest } from "../constants/api";
import ProfileInfo from "../components/profile/ProfileInfo";
import Tabs from "../components/profile/Tabs";
import BookingCard from "../components/profile/BookedCard";
import CreatedVenueCard from "../components/profile/CreatedVenueCard";

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const [activeTab, setActiveTab] = useState("Upcoming Bookings");

  const upcomingBookings = profile?.bookings?.filter(
    (b) => new Date(b.dateFrom) >= new Date()
  );
  const previousBookings = profile?.bookings?.filter(
    (b) => new Date(b.dateFrom) < new Date()
  );
  const createdVenues = profile?.venues || [];

  useEffect(() => {
    async function fetchProfile() {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("accessToken");

      // If user not logged in or accessing someone else's profile
      if (
        !token ||
        !user ||
        username.toLowerCase() !== user.name.toLowerCase()
      ) {
        setUnauthorized(true);
        return;
      }

      try {
        const result = await apiRequest(
          `${API_PROFILES}/${user.name}?_bookings=true&_venues=true`
        );

        setProfile(result.data);
      } catch (error) {
        console.error("❌ Failed to fetch profile:", error);
      }
    }

    fetchProfile();
  }, [username]);

  if (unauthorized) return <Navigate to="/unauthorized" />;
  if (!profile) return <div>Loading profile...</div>;

  return (
    <section className="max-w-4xl mx-auto px-4">
      <ProfileInfo profile={profile} />
      <Tabs
        tabs={["Upcoming Bookings", "Previous Bookings", "My Venues"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="mt-8 space-y-3">
        {activeTab === "Upcoming Bookings" &&
          upcomingBookings.map((b) => <BookingCard key={b.id} booking={b} />)}

        {activeTab === "Previous Bookings" &&
          previousBookings.map((b) => <BookingCard key={b.id} booking={b} />)}

        {activeTab === "My Venues" &&
          createdVenues.map((v) => <CreatedVenueCard key={v.id} venue={v} />)}
      </div>
    </section>
  );
}
