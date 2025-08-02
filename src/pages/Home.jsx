import React, { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard";
import { apiRequest } from "../constants/api";
import { useSearch } from "../context/SearchContext";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query, results, loading: searchLoading } = useSearch();

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

  const isSearching = query.trim().length > 0;
  const isLoading = isSearching ? searchLoading : loading;
  const displayVenues = isSearching ? results : venues;

  if (isLoading) {
    return <div className="pt-24 px-4">Loading venues...</div>;
  }

  return (
    <div className="pt-24 px-4 flex justify-center">
      <div className="max-x-[1200px]">
        {/* {isSearching && (
        <p className="mb-4 text-sm text-gray-600">
          Showing results for “<strong>{query}</strong>”
        </p>
      )} */}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayVenues.length > 0 ? (
            displayVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))
          ) : (
            <p className="text-sm text-gray-600 col-span-full">
              No venues found for “<strong>{query}</strong>”.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import VenueCard from "../components/VenueCard";
// import { apiRequest } from "../constants/api";
// import { useSearch } from "../context/SearchContext";

// export default function Home() {
//   const [venues, setVenues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { query, results, loading: searchLoading } = useSearch();

//   useEffect(() => {
//     async function fetchVenues() {
//       try {
//         const response = await apiRequest("/holidaze/venues");
//         setVenues(response.data);
//       } catch (error) {
//         console.error("Failed to fetch venues:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchVenues();
//   }, []);

//   const isSearching = query.trim().length > 0;
//   const isLoading = isSearching ? searchLoading : loading;
//   const displayVenues = isSearching ? results : venues;

//   if (isLoading) {
//     return <div className="pt-24 px-4">Loading venues...</div>;
//   }

//   return (
//     <div className="pt-24 px-4">
//       {/* {isSearching && (
//         <p className="mb-4 text-sm text-gray-600">
//           Showing results for “<strong>{query}</strong>”
//         </p> */}
//       {/* )} */}

//       {displayVenues.length > 0 ? (
//         <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           {displayVenues.map((venue) => (
//             <VenueCard key={venue.id} venue={venue} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-sm text-gray-600">
//           No venues found for “<strong>{query}</strong>”.
//         </p>
//       )}
//     </div>
//   );
// }
