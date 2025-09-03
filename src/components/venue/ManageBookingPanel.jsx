import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import { API_BOOKINGS, apiRequest } from "../../constants/api";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Calendar from "../ui/Calendar";

const MSG_CLEAR_MS = 3000;
const PARENT_REFRESH_DELAY_MS = 1200;

export default function ManageBookingPanel({
  venue,
  bookingId,
  onChanged,
  className = "",
}) {
  const current =
    (venue?.bookings || []).find((b) => b.id === bookingId) || null;

  // State
  const [openEdit, setOpenEdit] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Edit state
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");

  // timers cleanup
  const timers = useRef([]);

  // Build unavailable date list
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

  // helpers
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

  // Initialize edit inputs from current booking
  useEffect(() => {
    if (current) {
      setEditCheckIn(toYMD(current.dateFrom));
      setEditCheckOut(toYMD(current.dateTo));
    } else {
      setEditCheckIn("");
      setEditCheckOut("");
    }
  }, [current, bookingId]);

  // Cleanup
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  // price per guests
  const price = Number(venue?.price ?? 0);
  const guests = current?.guests ?? 0;
  const n = current ? nights(current.dateFrom, current.dateTo) : 0;
  const total = current ? n * price : 0;

  // Banner helpers
  function showMessage(type, text) {
    setMsg({ type, text });
    const t = setTimeout(() => setMsg({ type: "", text: "" }), MSG_CLEAR_MS);
    timers.current.push(t);
  }
  function afterSuccessRefresh() {
    if (!onChanged) return;
    const t = setTimeout(() => {
      onChanged();
    }, PARENT_REFRESH_DELAY_MS);
    timers.current.push(t);
  }

  //  Actions
  async function saveNewDates() {
    if (!editCheckIn || !editCheckOut) return;
    if (new Date(editCheckIn) >= new Date(editCheckOut)) return;
    if (editHasConflict) return;

    setMsg({ type: "", text: "" });
    try {
      setBusy(true);
      await apiRequest(`${API_BOOKINGS}/${bookingId}`, "PUT", {
        dateFrom: editCheckIn,
        dateTo: editCheckOut,
      });
      setOpenEdit(false);
      showMessage("success", "Booking updated.");
      afterSuccessRefresh();
    } catch (e) {
      console.error(e);
      showMessage("error", "Could not update booking.");
    } finally {
      setBusy(false);
    }
  }

  async function cancelBooking() {
    if (!confirm("Cancel this booking?")) return;
    setMsg({ type: "", text: "" });
    try {
      setBusy(true);
      await apiRequest(`${API_BOOKINGS}/${bookingId}`, "DELETE");
      showMessage("success", "Booking cancelled.");
      afterSuccessRefresh();
    } catch (e) {
      console.error(e);
      showMessage("error", "Could not cancel booking.");
    } finally {
      setBusy(false);
    }
  }

  // If booking not found
  if (!current) {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const profileUrl = user?.name ? `/profile/${user.name}` : "/";

    return (
      <aside
        className={`border border-gray-200 rounded-lg p-4 shadow-lg bg-white ${className}`}
      >
        <p className="text-sm text-gray-600 mb-3">
          Booking not found or has been cancelled.
        </p>
        <Link
          to={profileUrl}
          className="inline-flex items-center gap-1 text-sm text-green-700 no-underline"
        >
          <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
          <span>Return to your profile</span>
        </Link>
      </aside>
    );
  }

  return (
    <aside
      className={`border border-gray-200 rounded-lg p-4 shadow-lg bg-white ${className}`}
    >
      <h1 className="text-xl font-bold">Your booking</h1>

      {msg.text && (
        <div
          aria-live="polite"
          className={`mt-3 mb-2 text-sm rounded px-3 py-2 ${
            msg.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="mt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">
            {formatDate(current.dateFrom)} → {formatDate(current.dateTo)}
          </span>
          <span className="text-gray-600">
            {n} night{n > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Guests: {guests}</span>
          <span className="font-medium">{total} NOK</span>
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

      {/* Edit modal */}
      <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)}>
        <div className="flex flex-col h-full">
          {/* Content area */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Change your dates</h3>

            <div className="space-y-3">
              <Calendar
                label="Check-in"
                valueISO={editCheckIn}
                minISO={todayYMD}
                disabledISO={bookedDates}
                onChange={(iso) => {
                  setEditCheckIn(iso);

                  if (
                    editCheckOut &&
                    iso &&
                    new Date(`${editCheckOut}T00:00:00`) <=
                      new Date(`${iso}T00:00:00`)
                  ) {
                    setEditCheckOut("");
                  }
                  setMsg({ type: "", text: "" });
                }}
              />

              <Calendar
                label="Check-out"
                valueISO={editCheckOut}
                minISO={editCheckIn || todayYMD}
                disabledISO={bookedDates}
                onChange={(iso) => {
                  setEditCheckOut(iso);
                  setMsg({ type: "", text: "" });
                }}
              />

              {/* Validation messages */}
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

          {/* Buttons fixed at bottom */}
          <div className="flex justify-end gap-2 pt-4 mt-4 ">
            <button
              className="border rounded px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
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
