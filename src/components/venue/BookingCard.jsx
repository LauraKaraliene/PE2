import { useState } from "react";

export default function BookingCard({ venue, className = "" }) {
  const { price, maxGuests } = venue;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const total = nights * price;

  return (
    <div
      className={
        "border border-gray-300 rounded-lg p-6 shadow-lg w-full max-w-sm mx-auto"
      }
    >
      <div className="text-xl font-semibold mb-4">
        {price} NOK <span className="text-sm font-normal">night</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Check-in</label>
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Check-out</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: maxGuests }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={!checkIn || !checkOut || nights === 0}
          className="btn-primary  w-full disabled:cursor-not-allowed"
        >
          Book now
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
