import React from "react";
import VenueCard from "../components/VenueCard";

export default function Home() {
  return (
    <div className="pt-20 px-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <VenueCard />
      <VenueCard />
      <VenueCard />
      <VenueCard />
    </div>
  );
}
