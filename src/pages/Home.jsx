// import React from "react";
// import VenueCard from "../components/VenueCard";

// export default function Home() {
//   return (
//     <div className="pt-20 px-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//       <VenueCard />
//       <VenueCard />
//       <VenueCard />
//       <VenueCard />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard";
import { apiRequest } from "../constants/api";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await apiRequest("/holidaze/venues");
        setVenues(response.data);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  if (loading) return <div className="pt-24 px-4">Loading venues...</div>;

  return (
    <div className="pt-24 px-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
