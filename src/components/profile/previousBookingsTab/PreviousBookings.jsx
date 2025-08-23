// import BookedVenueCard from "../BookedVenueCard";

// export default function BookingsTab({ bookings = [] }) {
//   if (!bookings.length)
//     return <p className="text-sm text-gray-600">Nothing here yet...</p>;
//   return (
//     <div className="space-y-3 mb-6">
//       {bookings.map((b) => (
//         <BookedVenueCard key={b.id} booking={b} />
//       ))}
//     </div>
//   );
// }

// src/components/profile/previousBookingsTab/PreviousBookings.jsx
import BookedVenueCard from "../BookedVenueCard";

export default function PreviousBookings({ bookings = [] }) {
  if (!bookings.length) {
    return <p className="text-sm text-gray-600">Nothing here yet...</p>;
  }

  return (
    <div className="space-y-3 mb-6">
      {bookings.map((b) => (
        <BookedVenueCard key={b.id} booking={b} />
      ))}
    </div>
  );
}
