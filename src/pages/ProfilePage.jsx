import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileInfo from "../components/profile/ProfileInfo";
import Tabs from "../components/profile/Tabs";
import BookingCard from "../components/profile/BookingCard";
import VenueCard from "../components/profile/VenueCard";

export default function ProfilePage() {
  const { username } = useParams(); // assume your route is like /profile/:username
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("Upcoming Bookings");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}?_bookings=true&_venues=true`
        );
        const result = await response.json();
        setProfile(result.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }

    fetchProfile();
  }, [username]);

  if (!profile) return <div>Loading profile...</div>;

  // Separate bookings into upcoming and previous
  const now = new Date();
  const upcomingBookings = profile.bookings?.filter(
    (b) => new Date(b.dateFrom) > now
  );
  const previousBookings = profile.bookings?.filter(
    (b) => new Date(b.dateFrom) <= now
  );

  const tabs = [
    "Upcoming Bookings",
    "Previous Bookings",
    ...(profile.venueManager ? ["My Venues"] : []),
  ];

  return (
    <section className="max-w-5xl mx-auto px-4">
      <ProfileInfo profile={profile} />

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6 grid gap-4">
        {activeTab === "Upcoming Bookings" &&
          upcomingBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}

        {activeTab === "Previous Bookings" &&
          previousBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}

        {activeTab === "My Venues" &&
          profile.venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
      </div>
    </section>
  );
}
