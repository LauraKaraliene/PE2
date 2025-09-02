import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import VenueCard from "../components/VenueCard";
import Pagination from "../components/common/Pagination";
import { apiRequest } from "../constants/api";
import { useSearch } from "../context/SearchContext";
import Loader from "../components/Loader";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = useMemo(
    () => Math.max(1, parseInt(searchParams.get("page") || "1", 10)),
    [searchParams]
  );

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { query, results, loading: searchLoading } = useSearch();

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (query.trim()) return;
    const next = new URLSearchParams(searchParams);
    next.set("page", String(currentPage));
    setSearchParams(next, { replace: true });
  }, [currentPage, query, searchParams, setSearchParams]);

  useEffect(() => {
    let mounted = true;

    async function fetchVenues() {
      try {
        setLoading(true);

        const minDelay = new Promise((res) => setTimeout(res, 1000));
        const response = await apiRequest(
          `/holidaze/venues?page=${currentPage}&limit=30&sort=created&sortOrder=desc`
        );

        await minDelay;
        if (!mounted) return;

        setVenues(response.data);
        if (response.meta) {
          setTotalPages(response.meta.pageCount || 1);
          setTotalCount(response.meta.totalCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // only fetch if not searching
    if (!query.trim()) {
      fetchVenues();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [currentPage, query]);

  const isSearching = query.trim().length > 0;
  const isLoading = isSearching ? searchLoading : loading;
  const displayVenues = isSearching ? results : venues;

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader size={80} label="Loading venues…" />
      </div>
    );
  }

  return (
    <div className="px-4 flex justify-center flex-col">
      <div className="max-w-[1200px] mx-auto">
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
              <VenueCard
                key={venue.id}
                venue={venue}
                linkState={{ fromPage: currentPage }}
              />
            ))
          ) : (
            <p className="text-sm text-gray-600 col-span-full text-center">
              {isSearching
                ? `No venues found for "${query}".`
                : "No venues available."}
            </p>
          )}
        </div>

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
