/**
 * My Venues tab component.
 *
 * - Displays a list of venues created by the user.
 * - Allows venue managers to add new venues using a modal form.
 * - Handles conditional rendering based on user permissions (`canCreate`).
 *
 * @param {object} props - Component props.
 * @param {Array} props.venues - The list of venues created by the user.
 * @param {boolean} props.canCreate - Indicates whether the user can create venues.
 * @param {function} props.onRefresh - Callback function to refresh the venue list after a new venue is created.
 * @returns {JSX.Element} The rendered My Venues tab.
 */

import { useState } from "react";
import CreatedVenueCard from "./CreatedVenueCard";
import Modal from "../../common/Modal";
import AddVenueForm from "../../venue/AddVenueForm";

export default function MyVenuesTab({ venues = [], canCreate, onRefresh }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-start mb-6">
        <button
          className="btn btn-primary text-sm mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setOpen(true)}
          disabled={!canCreate}
        >
          + Add venue
        </button>

        {!canCreate && (
          <p className="text-sm text-red-600">
            You must be a venue manager to add a venue. Use “Become Manager” on
            your profile.
          </p>
        )}
      </div>

      {venues.length === 0 ? (
        <p className="text-sm">No created venues yet...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((v) => (
            <CreatedVenueCard key={v.id} venue={v} />
          ))}
        </div>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} size="auto">
        <h3 className="text-lg font-semibold mb-4">Create venue</h3>
        <AddVenueForm
          onClose={() => setOpen(false)}
          onCreated={() => onRefresh?.()}
        />
      </Modal>
    </>
  );
}
