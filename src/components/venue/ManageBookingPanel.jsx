/**
 * Manage booking panel component.
 *
 * - Displays details of a specific booking, including dates, guests, and total cost.
 * - Allows users to change booking dates or cancel the booking.
 * - Validates date changes to avoid conflicts with existing bookings.
 * - Handles API requests for updating or deleting bookings.
 *
 * @param {object} props - Component props.
 * @param {object} props.venue - The venue data, including bookings.
 * @param {string} props.venue.id - The unique ID of the venue.
 * @param {number} props.venue.price - The price per night for the venue.
 * @param {Array} [props.venue.bookings] - An array of bookings for the venue.
 * @param {string} props.bookingId - The ID of the booking to manage.
 * @param {function} [props.onChanged] - Callback function triggered after a booking is updated or canceled.
 * @param {string} [props.className=""] - Additional CSS classes for the component.
 * @returns {JSX.Element} The rendered manage booking panel component.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import { updateBooking, deleteBooking } from "../bookings/CreateBooking";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Calendar from "../ui/Calendar";
import { useNotify } from "../store/notifications";

const PARENT_REFRESH_DELAY_MS = 1200;

export default function ManageBookingPanel({
  venue,
  bookingId,
  onChanged,
  className = "",
}) {
  const notify = useNotify((s) => s.push);

  const current =
    (venue?.bookings || []).find((b) => b.id === bookingId) || null;

  const [openEdit, setOpenEdit] = useState(false);
  const [busy, setBusy] = useState(false);

  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");

  const timers = useRef([]);

  const bookedDates = useMemo(() => {
    const list = [];
    (venue?.bookings || [])
      .filter((b) => b.id !== bookingId)
      .forEach((b) => {
        const start = new Date(b.dateFrom);
        const end = new Date(b.dateTo);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          list.push(d.toISOString().split("T")[0]);
        }
      });
    return list;
  }, [venue?.bookings, bookingId]);

  const editHasConflict = useMemo(() => {
    if (!editCheckIn || !editCheckOut) return false;
    const start = new Date(editCheckIn);
    const end = new Date(editCheckOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      if (bookedDates.includes(key)) return true;
    }
    return false;
  }, [editCheckIn, editCheckOut, bookedDates]);

  const toYMD = (d) => {
    const x = new Date(d);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const day = String(x.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const formatDate = (d) => new Date(d).toLocaleDateString();
  const nights = (from, to) => {
    const a = new Date(from);
    a.setHours(12, 0, 0, 0);
    const b = new Date(to);
    b.setHours(12, 0, 0, 0);
    return Math.max(1, Math.round((b - a) / 86_400_000));
  };
  const todayYMD = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (current) {
      setEditCheckIn(toYMD(current.dateFrom));
      setEditCheckOut(toYMD(current.dateTo));
    } else {
      setEditCheckIn("");
      setEditCheckOut("");
    }
  }, [current, bookingId]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const price = Number(venue?.price ?? 0);
  const guests = current?.guests ?? 0;
  const n = current ? nights(current.dateFrom, current.dateTo) : 0;
  const total = current ? n * price : 0;

  function afterSuccessRefresh() {
    if (!onChanged) return;
    const t = setTimeout(() => onChanged(), PARENT_REFRESH_DELAY_MS);
    timers.current.push(t);
  }

  const toISO = (s) =>
    typeof s === "string" && s.includes("T") ? s : `${s}T00:00:00.000Z`;

  async function saveNewDates() {
    if (!editCheckIn || !editCheckOut) return;
    if (new Date(editCheckIn) >= new Date(editCheckOut)) return;
    if (editHasConflict) return;

    try {
      setBusy(true);
      await updateBooking(bookingId, {
        dateFrom: editCheckIn,
        dateTo: editCheckOut,
      });
      setOpenEdit(false);
      notify({ type: "success", message: "Booking updated." });
      afterSuccessRefresh();
    } catch (e) {
      console.error(e);
      notify({
        type: "error",
        message: e?.message || "Could not update booking.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function cancelBooking() {
    if (!confirm("Cancel this booking?")) return;
    try {
      setBusy(true);
      await deleteBooking(bookingId);
      notify({ type: "success", message: "Booking cancelled." });
      afterSuccessRefresh();
    } catch (e) {
      console.error(e);
      notify({ type: "error", message: "Could not cancel booking." });
    } finally {
      setBusy(false);
    }
  }

  if (!current) {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const profileUrl = user?.name ? `/profile/${user.name}` : "/";

    return (
      <aside
        className={`border border-[color:var(--color-background-gray)] rounded-lg p-4 shadow-lg bg-[color:var(--color-background)] ${className}`}
      >
        <p className="text-sm text-[color:var(--color-background-gray)] mb-3">
          Booking not found or has been cancelled.
        </p>
        <Link
          to={profileUrl}
          className="inline-flex items-center gap-1 text-sm text-[color:var(--color-primary)] no-underline"
        >
          <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
          <span>Return to your profile</span>
        </Link>
      </aside>
    );
  }

  return (
    <aside
      className={`border border-[color:var(--color-background-gray)] rounded-lg p-4 shadow-lg bg-[color:var(--color-background)] ${className}`}
    >
      <h1 className="text-xl font-bold text-[color:var(--color-neutral)]">
        Your booking
      </h1>

      <div className="mt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="font-medium text-[color:var(--color-neutral)]">
            {formatDate(current.dateFrom)} → {formatDate(current.dateTo)}
          </span>
          <span className="text-gray-400">
            {n} night{n > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[color:var(--color-neutral)]">
            Guests: {guests}
          </span>
          <span className="font-medium text-[color:var(--color-neutral)]">
            {total} NOK
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => setOpenEdit(true)}
          className="btn btn-primary text-sm cursor-pointer"
        >
          Change dates
        </button>
        <button
          type="button"
          onClick={cancelBooking}
          disabled={busy}
          className="text-red-600 border border-red-200 rounded px-3 py-2 text-sm disabled:opacity-60 cursor-pointer"
        >
          {busy ? "Working…" : "Cancel booking"}
        </button>
      </div>

      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        size="calendar"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-[color:var(--color-neutral)]">
              Change your dates
            </h3>

            <div className="space-y-3">
              <Calendar
                label="Check-in"
                valueISO={editCheckIn}
                minISO={todayYMD}
                disabledISO={bookedDates}
                onChange={(iso) => {
                  setEditCheckIn(iso);
                }}
              />

              <Calendar
                label="Check-out"
                valueISO={editCheckOut}
                minISO={editCheckIn || todayYMD}
                disabledISO={bookedDates}
                onChange={(iso) => {
                  setEditCheckOut(iso);
                }}
              />

              {editCheckIn &&
                editCheckOut &&
                new Date(editCheckIn) >= new Date(editCheckOut) && (
                  <p className="text-sm text-red-600">
                    Check-out must be after check-in.
                  </p>
                )}
              {editHasConflict && editCheckIn && editCheckOut && (
                <p className="text-sm text-red-600">
                  Selected dates conflict with existing bookings. Please choose
                  different dates.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 mt-4">
            <button
              className="border rounded px-3 py-2 text-sm cursor-pointer hover:bg-[color:var(--color-background-light)]"
              onClick={() => setOpenEdit(false)}
              disabled={busy}
            >
              Close
            </button>
            <button
              className="btn btn-primary text-sm disabled:opacity-60 cursor-pointer"
              onClick={saveNewDates}
              disabled={
                busy ||
                !editCheckIn ||
                !editCheckOut ||
                new Date(editCheckIn) >= new Date(editCheckOut) ||
                editHasConflict
              }
            >
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}
