/**
 * Host panel component.
 *
 * - Provides venue hosts with tools to manage their venues.
 * - Allows editing venue details, deleting venues, and viewing bookings.
 * - Displays a list of bookings with details such as dates, guests, and total price.
 *
 * @param {object} props - Component props.
 * @param {object} props.venue - The venue data.
 * @param {string} props.venue.id - The unique ID of the venue.
 * @param {number} props.venue.price - The price per night for the venue.
 * @param {Array} [props.venue.bookings] - An array of bookings for the venue.
 * @param {string} [props.className=""] - Additional CSS classes for the component.
 * @param {function} [props.onDeleted] - Callback function triggered after the venue is deleted.
 * @param {function} [props.onChanged] - Callback function triggered after the venue is updated.
 * @returns {JSX.Element} The rendered host panel component.
 */

import { useState } from "react";
import Modal from "../common/Modal";
import AddVenueForm from "../venue/AddVenueForm";
import { API_VENUES } from "../../constants/api";
import { apiRequest } from "../../utils/http";
import { useNotify } from "../store/notifications";

export default function HostPanel({
  venue,
  className = "",
  onDeleted,
  onChanged,
}) {
  const notify = useNotify((s) => s.push);
  const [deleting, setDeleting] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const bookings = venue?.bookings ?? [];
  const price = Number(venue?.price ?? 0);

  const formatDate = (d) => new Date(d).toLocaleDateString();
  const nights = (from, to) => {
    const a = new Date(from);
    a.setHours(12, 0, 0, 0);
    const b = new Date(to);
    b.setHours(12, 0, 0, 0);
    return Math.max(1, Math.round((b - a) / 86_400_000));
  };

  /**
   * Handles venue deletion.
   *
   * - Prompts the user for confirmation before deleting the venue.
   * - Sends a DELETE request to the API and triggers the `onDeleted` callback on success.
   */
  async function handleDelete() {
    if (!confirm("Delete this venue? This cannot be undone.")) return;
    try {
      setDeleting(true);
      await apiRequest(`${API_VENUES}/${venue.id}`, { method: "DELETE" });
      notify({ type: "success", message: "Venue deleted." });
      onDeleted?.();
    } catch (e) {
      console.error("Delete failed", e);
      notify({ type: "error", message: "Could not delete venue." });
      setDeleting(false);
    }
  }

  return (
    <aside
      className={`border border-[color:var(--color-background-gray)] rounded-lg p-4 shadow-lg bg-[color:var(--color-background)] ${className}`}
    >
      <h1 className="text-xl font-bold">Host panel</h1>

      <div className="flex gap-2 mt-3 mb-6">
        <button
          type="button"
          onClick={() => setOpenEdit(true)}
          className="btn btn-primary text-sm"
        >
          Edit Venue
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-600 border border-red-200 rounded px-3 py-2 text-sm disabled:opacity-60 inline-flex items-center gap-2"
        >
          {deleting && (
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {deleting ? "Deleting…" : "Delete Venue"}
        </button>
      </div>

      <h4 className="font-bold mt-6 mb-2">Venue Bookings</h4>
      {bookings.length === 0 ? (
        <p className="text-sm text-gray-500">No bookings yet.</p>
      ) : (
        <ul className="space-y-2">
          {bookings.map((b) => {
            const n = nights(b.dateFrom, b.dateTo);
            const total = n * price;
            const customer =
              b.customer?.name || b.customer?.email || "Customer";
            return (
              <li
                key={b.id}
                className="border border-[color:var(--color-background-gray)] rounded p-3 text-sm shadow-sm"
              >
                <div className="flex">
                  <span className="font-medium">
                    {formatDate(b.dateFrom)} → {formatDate(b.dateTo)}
                  </span>
                </div>
                <div className="flex mt-1">
                  <span>Guests: {b.guests}</span>
                </div>
                <div className="text-gray-500 mt-1">By: {customer}</div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">
                    {n} night{n > 1 ? "s" : ""}
                  </span>
                  <span className="font-medium">{total} NOK</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Edit modal */}
      <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)}>
        <h3 className="text-lg font-semibold mb-4">Edit venue</h3>
        <AddVenueForm
          venue={venue}
          onClose={() => setOpenEdit(false)}
          onUpdated={() => {
            setOpenEdit(false);
            onChanged?.();
          }}
        />
      </Modal>
    </aside>
  );
}
