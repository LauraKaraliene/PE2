import { useState, useMemo } from "react";
import { createBooking } from "../bookings/CreateBooking";

export default function BookingPanel({ venue, className = "" }) {
  const { price, maxGuests } = venue;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Get booked dates
  const bookedDates = useMemo(() => {
    if (!venue?.bookings) return [];

    const dates = [];
    venue.bookings.forEach((booking) => {
      const start = new Date(booking.dateFrom);
      const end = new Date(booking.dateTo);

      // Add all dates in the booking range
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split("T")[0]);
      }
    });

    return dates;
  }, [venue?.bookings]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const total = nights * price;

  // Check if selected dates conflict with bookings
  const hasConflict = useMemo(() => {
    if (!checkIn || !checkOut) return false;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Check each day in the selected range
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      if (bookedDates.includes(dateStr)) {
        return true;
      }
    }

    return false;
  }, [checkIn, checkOut, bookedDates]);

  async function handleBook() {
    if (!checkIn || !checkOut || nights === 0 || hasConflict) return;

    setMsg({ type: "", text: "" });

    try {
      setBusy(true);
      await createBooking({
        dateFrom: checkIn,
        dateTo: checkOut,
        guests: Number(guests),
        venueId: venue.id,
      });

      setMsg({
        type: "success",
        text: "Booking confirmed! See it in your profile → Upcoming bookings.",
      });

      // Clear form after a delay to show success message
      setTimeout(() => {
        setCheckIn("");
        setCheckOut("");
        setGuests(1);
        setMsg({ type: "", text: "" });
      }, 3000);
    } catch (e) {
      console.error(e);
      setMsg({
        type: "error",
        text: "Could not create booking. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={[
        "border border-gray-300 rounded-lg p-6 shadow-lg w-full max-w-sm mx-auto",
        className,
      ].join(" ")}
    >
      <div className="text-xl font-semibold mb-4">
        {price} NOK <span className="text-sm font-normal">night</span>
      </div>

      {msg.text && (
        <div
          className={`mb-3 text-sm rounded px-3 py-2 ${
            msg.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Check-in</label>
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setCheckIn(e.target.value);
              setMsg({ type: "", text: "" });
            }}
            className="w-full border border-gray-300 text-gray-600 rounded px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Check-out</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setCheckOut(e.target.value);
              setMsg({ type: "", text: "" });
            }}
            className="w-full border border-gray-300 text-gray-600 rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Show unavailable dates */}
        {bookedDates.length > 0 && (
          <div className="text-xs text-gray-600 bg-red-50 p-2 rounded">
            <div className="font-medium text-red-700 mb-1">
              Unavailable dates:
            </div>
            <div className="flex flex-wrap gap-1">
              {bookedDates
                .sort()
                .slice(0, 10)
                .map((date) => {
                  const d = new Date(date);
                  const formatted = d.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  });
                  return (
                    <span
                      key={date}
                      className="bg-red-200 text-red-800 px-1 py-0.5 rounded text-xs"
                    >
                      {formatted}
                    </span>
                  );
                })}
              {bookedDates.length > 10 && (
                <span className="text-red-600">
                  +{bookedDates.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-500 mb-1">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full border border-gray-300 text-gray-600 rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: maxGuests }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {hasConflict && checkIn && checkOut && (
          <p className="text-sm text-red-600">
            Selected dates conflict with existing bookings. Please choose
            different dates.
          </p>
        )}

        <button
          onClick={handleBook}
          disabled={
            !checkIn || !checkOut || nights === 0 || hasConflict || busy
          }
          className="btn-primary btn w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Booking..." : "Book now"}
        </button>

        {nights > 0 && !hasConflict && (
          <p className="text-sm text-gray-700 mt-2">
            {nights} night{nights > 1 ? "s" : ""} × {price} ={" "}
            <strong>{total} NOK</strong>
          </p>
        )}
      </div>
    </div>
  );
}
