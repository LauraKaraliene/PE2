import { useState } from "react";
import CreatedVenueCard from "./CreatedVenueCard";
import Modal from "../../common/Modal";
import AddVenueForm from "../../venue/AddVenueForm";

export default function MyVenuesTab({ venues = [], canCreate, onRefresh }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center mb-6">
        {canCreate && (
          <button
            className="btn-primary btn text-sm"
            onClick={() => setOpen(true)}
          >
            + Add venue
          </button>
        )}
      </div>

      {venues.length === 0 ? (
        <p className="text-sm text-gray-600">No venues yet...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <CreatedVenueCard key={v.id} venue={v} />
          ))}
        </div>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">Create venue</h3>
        <AddVenueForm
          onClose={() => setOpen(false)}
          onCreated={() => onRefresh?.()}
        />
      </Modal>
    </>
  );
}
