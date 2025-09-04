import { useState } from "react";
import placeholderBanner from "../../assets/placeholder.png";
import placeholderAvatar from "../../assets/placeholder.png";
import Modal from "../common/Modal";
import EditProfileForm from "./EditProfileForm";

export default function ProfileInfo({ profile }) {
  const [showModal, setShowModal] = useState(false);

  const bannerUrl = profile?.banner?.url || placeholderBanner;
  const avatarUrl = profile?.avatar?.url || placeholderAvatar;
  const name = profile?.name || "Unknown";
  const email = profile?.email || "Not provided";

  return (
    <div className="relative mb-20">
      {/* Banner */}
      <img
        src={bannerUrl}
        alt={profile?.banner?.alt || "User banner"}
        className="w-full h-48 object-cover rounded-lg"
      />

      {/* Avatar and User Info */}
      <div className="flex items-center gap-6 absolute left-6 -bottom-12 bg-[color:var(--color-background)] p-4 rounded-lg shadow-lg">
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

          {/* Edit button below email */}
          <button
            onClick={() => setShowModal(true)}
            className="text-[color:var(--color-accent)] text-sm mt-2 hover:underline underline-offset-4"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal for edit form */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-heading font-semibold mb-4 text-[color:var(--color-neutral)]">
          Edit Profile
        </h2>
        <EditProfileForm
          profile={profile}
          onClose={() => setShowModal(false)}
          onUpdated={() => {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }}
        />
      </Modal>
    </div>
  );
}
