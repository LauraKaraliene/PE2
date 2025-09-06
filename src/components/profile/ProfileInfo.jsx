/**
 * Profile information component.
 *
 * - Displays the user's profile information, including banner, avatar, name, and email.
 * - Provides options to edit the profile or become a venue manager.
 * - Handles modals for editing the profile and becoming a venue manager.
 * - Displays notifications and banners for success or error messages.
 *
 * @param {object} props - Component props.
 * @param {object} props.profile - The user's profile data.
 * @param {string} props.profile.name - The user's name.
 * @param {string} props.profile.email - The user's email.
 * @param {object} [props.profile.avatar] - The user's avatar data.
 * @param {string} [props.profile.avatar.url] - The URL of the user's avatar image.
 * @param {string} [props.profile.avatar.alt] - The alt text for the user's avatar image.
 * @param {object} [props.profile.banner] - The user's banner data.
 * @param {string} [props.profile.banner.url] - The URL of the user's banner image.
 * @param {string} [props.profile.banner.alt] - The alt text for the user's banner image.
 * @param {boolean} props.profile.venueManager - Indicates whether the user is a venue manager.
 * @param {function} props.onBecameManager - Callback function to refresh the profile after becoming a venue manager.
 * @returns {JSX.Element} The rendered profile information component.
 */

import { useState, useRef, useEffect } from "react";
import placeholderBanner from "../../assets/placeholder.png";
import placeholderAvatar from "../../assets/placeholder.png";
import Modal from "../common/Modal";
import EditProfileForm from "./EditProfileForm";
import { API_PROFILES } from "../../constants/api";
import { apiRequest } from "../../utils/http";
import { useNotify } from "../store/notifications";

export default function ProfileInfo({ profile, onBecameManager }) {
  const notify = useNotify((s) => s.push);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState({ type: "", text: "" });
  const timers = useRef([]);

  const bannerUrl = profile?.banner?.url || placeholderBanner;
  const avatarUrl = profile?.avatar?.url || placeholderAvatar;
  const name = profile?.name || "Unknown";
  const email = profile?.email || "Not provided";
  const isManager = profile?.venueManager === true;

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  /**
   * Handles the process of becoming a venue manager.
   *
   * - Sends a request to update the user's role to venue manager.
   * - Displays success or error notifications based on the response.
   */
  async function handleBecomeManager() {
    if (!agree || busy) return;
    setBanner({ type: "", text: "" });

    try {
      setBusy(true);
      await apiRequest(`${API_PROFILES}/${name}`, {
        method: "PUT",
        body: { venueManager: true },
      });

      notify({
        type: "success",
        message:
          "You are now a venue manager! You can add venues in the My Venues tab.",
      });
      setShowManagerModal(false);
      onBecameManager?.();

      if (!onBecameManager) {
        const t = setTimeout(() => window.location.reload(), 800);
        timers.current.push(t);
      }
    } catch (e) {
      console.error(e);
      notify({
        type: "error",
        message: e?.message || "Could not update role. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative mb-20">
      {banner.text && (
        <div
          aria-live="polite"
          className={`mb-3 text-sm rounded px-3 py-2 ${
            banner.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {banner.text}
        </div>
      )}

      {/* Banner image */}
      <img
        src={bannerUrl}
        alt={profile?.banner?.alt || "User banner"}
        className="w-full h-48 object-cover rounded-lg"
      />

      {/* Avatar and User Info */}
      <div className="flex items-center gap-6 absolute left-6 -bottom-12 bg-[color:var(--color-background)] ps-0 p-4 rounded-lg shadow-lg">
        <img
          src={avatarUrl}
          alt={profile?.avatar?.alt || "User avatar"}
          className="w-24 h-24 rounded-full object-cover border-4 border-[color:var(--color-background)]"
        />
        <div>
          <h1 className="text-xl font-heading font-bold text-[color:var(--color-neutral)]">
            {name}
          </h1>
          <p className="text-sm text-[color:var(--color-neutral)]">{email}</p>

          {/* Edit Profile */}
          <button
            onClick={() => setShowEditModal(true)}
            className="text-[color:var(--color-accent)] text-sm mt-2 hover:underline underline-offset-4 block"
          >
            Edit Profile
          </button>

          {/* Become Manager (only if not manager yet) */}
          {!isManager && (
            <button
              onClick={() => setShowManagerModal(true)}
              className="text-[color:var(--color-accent)] text-sm mt-1 hover:underline underline-offset-4 block"
            >
              Become a Venue Manager
            </button>
          )}
        </div>
      </div>

      {/* Modal for edit form */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <h2 className="text-xl font-heading font-semibold mb-4 text-[color:var(--color-neutral)]">
          Edit Profile
        </h2>
        <EditProfileForm
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => {
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          }}
        />
      </Modal>

      {/* Become Manager modal */}
      <Modal
        isOpen={showManagerModal}
        onClose={() => setShowManagerModal(false)}
      >
        <h2 className="text-xl font-semibold mb-3">Become a Venue Manager</h2>
        <p className="text-sm mb-4">
          As a venue manager you’ll be able to create and manage your own
          venues.
        </p>

        <label className="flex items-start gap-2 mb-4">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm leading-tight">
            I understand that I’ll be responsible for my venue listings and
            bookings.
          </span>
        </label>

        <div className="flex justify-end gap-2">
          <button
            className="border rounded px-3 py-2 text-sm cursor-pointer"
            onClick={() => setShowManagerModal(false)}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            onClick={handleBecomeManager}
            disabled={!agree || busy}
          >
            {busy ? "Saving…" : "Confirm"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
