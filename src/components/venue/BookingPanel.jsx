import { useState, useMemo } from "react";
import { createBooking } from "../bookings/CreateBooking";
import Calendar from "../ui/Calendar";

export default function BookingPanel({ venue, className = "" }) {
  const { price, maxGuests } = venue;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Booked dates
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

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(`${checkIn}T12:00:00`);
    const end = new Date(`${checkOut}T12:00:00`);
    const diff = Math.round((end - start) / 86_400_000);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const total = nights * price;
  const todayISO = new Date().toISOString().split("T")[0];

  async function handleBook() {
    if (!checkIn || !checkOut || nights === 0) return;
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
            setMsg({ type: "", text: "" });
          }}
        />

        <Calendar
          label="Check-out"
          valueISO={checkOut}
          minISO={checkIn || todayISO}
          disabledISO={bookedDates}
          onChange={(iso) => {
            setCheckOut(iso);
            setMsg({ type: "", text: "" });
          }}
        />

        <div>
          <label className="block text-sm text-gray-500 mb-1">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full border border-gray-300 text-gray-700 rounded px-2 py-2 text-sm"
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
          <p className="text-sm text-gray-700 mt-2">
            {nights} night{nights > 1 ? "s" : ""} × {price} ={" "}
            <strong>{total} NOK</strong>
          </p>
        )}
      </div>
    </div>
  );
}
