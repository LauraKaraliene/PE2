import { useState } from "react";
import { apiRequest } from "../../constants/api";
import Modal from "../common/Modal";
import AddVenueForm from "../venue/AddVenueForm";
import { API_VENUES } from "../../constants/api";

export default function HostPanel({
  venue,
  className = "",
  onDeleted,
  onChanged,
}) {
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
    const dayMs = 86_400_000;
    return Math.max(1, Math.round((b - a) / dayMs));
  };

  async function handleDelete() {
    if (!confirm("Delete this venue? This cannot be undone.")) return;
    try {
      setDeleting(true);
      await apiRequest(`${API_VENUES}/${venue.id}`, "DELETE");
      onDeleted?.();
    } catch (e) {
      console.error("Delete failed", e);
      setDeleting(false);
      alert("Could not delete venue.");
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
          className="text-red-600 border border-red-200 rounded px-3 py-2 text-sm disabled:opacity-60"
        >
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
                <div className="flex ">
                  <span className="font-medium">
                    {formatDate(b.dateFrom)} → {formatDate(b.dateTo)}
                  </span>
                </div>
                <div className="flex  mt-1">
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
