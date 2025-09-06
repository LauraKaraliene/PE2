/**
 * Booking panel component.
 *
 * - Allows users to select check-in and check-out dates, the number of guests, and book a venue.
 * - Validates user input and ensures dates and guest limits are within allowed ranges.
 * - Displays the total cost based on the selected dates and venue price.
 * - Handles API requests for creating bookings and displays success or error messages.
 *
 * @param {object} props - Component props.
 * @param {object} props.venue - The venue data.
 * @param {number} props.venue.price - The price per night for the venue.
 * @param {number} props.venue.maxGuests - The maximum number of guests allowed at the venue.
 * @param {Array} [props.venue.bookings] - An array of existing bookings for the venue.
 * @param {string} [props.className=""] - Additional CSS classes for the component.
 * @returns {JSX.Element} The rendered booking panel component.
 */

import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import createBooking from "../bookings/CreateBooking";
import Calendar from "../ui/Calendar";
import { useNotify } from "../store/notifications";

export default function BookingPanel({ venue, className = "" }) {
  const { price, maxGuests } = venue;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [busy, setBusy] = useState(false);

  const notify = useNotify((s) => s.push);
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate booked dates
  const bookedDates = useMemo(() => {
    if (!venue?.bookings) return [];
    const dates = [];
    venue.bookings.forEach((booking) => {
      const start = new Date(booking.dateFrom);
      const end = new Date(booking.dateTo);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split("T")[0]);
      }
    });
    return dates;
  }, [venue?.bookings]);

  // Calculate the number of nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(`${checkIn}T12:00:00`);
    const end = new Date(`${checkOut}T12:00:00`);
    const diff = Math.round((end - start) / 86_400_000);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const total = nights * price;
  const todayISO = new Date().toISOString().split("T")[0];

  /**
   * Handles the booking process.
   *
   * - Validates user input and ensures the user is logged in.
   * - Sends a booking request to the API.
   * - Displays success or error messages based on the result.
   */
  async function handleBook() {
    if (!checkIn || !checkOut || nights === 0 || busy) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      notify({ type: "error", message: "Please log in to make a booking." });
      const returnTo = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?returnTo=${returnTo}`);
      return;
    }

    try {
      setBusy(true);

      await createBooking({
        dateFrom: checkIn,
        dateTo: checkOut,
        guests: Number(guests),
        venueId: venue.id,
      });

      notify({
        type: "success",
        message:
          "Booking confirmed! See it in your profile → Upcoming bookings.",
      });

      // reset fields
      setCheckIn("");
      setCheckOut("");
      setGuests(1);
    } catch (e) {
      notify({
        type: "error",
        message: e?.message || "Could not create booking. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={[
        "border border-[color:var(--color-background-gray)] rounded-lg p-6 shadow-lg w-full max-w-sm mx-auto",
        className,
      ].join(" ")}
    >
      <div className="text-xl font-semibold mb-4 text-[color:var(--color-neutral)]">
        {price} NOK <span className="text-sm font-normal">night</span>
      </div>

      <div className="space-y-3">
        <Calendar
          label="Check-in"
          valueISO={checkIn}
          minISO={todayISO}
          disabledISO={bookedDates}
          onChange={(iso) => {
            setCheckIn(iso);
            if (
              checkOut &&
              iso &&
              new Date(`${checkOut}T00:00:00`) <= new Date(`${iso}T00:00:00`)
            ) {
              setCheckOut("");
            }
          }}
        />

        <Calendar
          label="Check-out"
          valueISO={checkOut}
          minISO={checkIn || todayISO}
          disabledISO={bookedDates}
          onChange={(iso) => setCheckOut(iso)}
        />

        <div>
          <label className="block text-sm text-[color:var(--color-neutral)] mb-1">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full border border-[color:var(--color-background-gray)] text-[color:var(--color-neutral)] rounded px-2 py-2 text-sm"
          >
            {Array.from({ length: maxGuests }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleBook}
          disabled={!checkIn || !checkOut || nights === 0 || busy}
          className="btn-primary btn w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Booking..." : "Book now"}
        </button>

        {nights > 0 && (
          <p className="text-sm text-[color:var(--color-neutral)] mt-2">
            {nights} night{nights > 1 ? "s" : ""} × {price} ={" "}
            <strong>{total} NOK</strong>
          </p>
        )}
      </div>
    </div>
  );
}
