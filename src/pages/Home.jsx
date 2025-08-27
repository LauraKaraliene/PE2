import React, { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard";
import Pagination from "../components/common/Pagination";
import { apiRequest } from "../constants/api";
import { useSearch } from "../context/SearchContext";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { query, results, loading: searchLoading } = useSearch();

  useEffect(() => {
    async function fetchVenues() {
      try {
        setLoading(true);
        // Add pagination parameters to the API call
        const response = await apiRequest(
          `/holidaze/venues?page=${currentPage}&limit=30`
        );

        setVenues(response.data);

        // Extract pagination info from meta
        if (response.meta) {
          setTotalPages(response.meta.pageCount || 1);
          setTotalCount(response.meta.totalCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if not searching
    if (!query.trim()) {
      fetchVenues();
    }
  }, [currentPage, query]);

  const isSearching = query.trim().length > 0;
  const isLoading = isSearching ? searchLoading : loading;
  const displayVenues = isSearching ? results : venues;

  // Pagination component
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <div className="pt-24 px-4">Loading venues...</div>;
  }

  return (
    <div className=" px-4 flex justify-center flex-col">
      <div className="max-w-[1200px] mx-auto">
        {/* Pagination at the top */}
        {!isSearching && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayVenues.length > 0 ? (
            displayVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))
          ) : (
            <p className="text-sm text-gray-600 col-span-full text-center">
              {isSearching
                ? `No venues found for "${query}".`
                : "No venues available."}
            </p>
          )}
        </div>

        {/* Pagination at the bottom too (optional) */}
        {!isSearching && totalPages > 5 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
