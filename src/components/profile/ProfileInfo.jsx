import { useState, useRef, useEffect } from "react";
import placeholderBanner from "../../assets/placeholder.png";
import placeholderAvatar from "../../assets/placeholder.png";
import Modal from "../common/Modal";
import EditProfileForm from "./EditProfileForm";
import { apiRequest, API_PROFILES } from "../../constants/api";

export default function ProfileInfo({ profile, onBecameManager }) {
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

  function showBanner(type, text, autoclearMs = 2500) {
    setBanner({ type, text });
    if (autoclearMs) {
      const t = setTimeout(
        () => setBanner({ type: "", text: "" }),
        autoclearMs
      );
      timers.current.push(t);
    }
  }

  async function handleBecomeManager() {
    if (!agree || busy) return;
    setBanner({ type: "", text: "" });
    try {
      setBusy(true);
      await apiRequest(`${API_PROFILES}/${name}`, "PUT", {
        venueManager: true,
      });
      showBanner(
        "success",
        "You're now a venue manager! You can add venues in the My Venues tab."
      );
      setShowManagerModal(false);
      // Ask parent to refresh profile (no full page reload needed)
      onBecameManager?.();
      // Fallback: light reload if parent didn't pass a refresher
      if (!onBecameManager) {
        const t = setTimeout(() => window.location.reload(), 800);
        timers.current.push(t);
      }
    } catch (e) {
      console.error(e);
      showBanner("error", "Could not update role. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative mb-20">
      {/* Top inline banner */}
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

      {/* Avatar + info card */}
      <div className="flex items-center gap-6 absolute left-6 -bottom-12 bg-white p-4 rounded-lg shadow-lg">
        <img
          src={avatarUrl}
          alt={profile?.avatar?.alt || "User avatar"}
          className="w-24 h-24 rounded-full object-cover border-4 border-white"
        />
        <div>
          <h1 className="text-xl font-bold">{name}</h1>
          <p className="text-gray-600 text-sm">{email}</p>

          <div className="flex flex-col items-start mt-2">
            {/* Edit profile */}
            <button
              onClick={() => setShowEditModal(true)}
              className="text-green-700 text-sm cursor-pointer "
            >
              Edit Profile
            </button>

            {/* Become manager (only if not yet) */}
            {!isManager && (
              <button
                onClick={() => setShowManagerModal(true)}
                className="text-green-700 text-sm cursor-pointer"
              >
                Become Manager
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <EditProfileForm
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => {
            // refresh after edit (your existing behavior)
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

// import { useState } from "react";
// import placeholderBanner from "../../assets/placeholder.png";
// import placeholderAvatar from "../../assets/placeholder.png";
// import Modal from "../common/Modal";
// import EditProfileForm from "./EditProfileForm";

// export default function ProfileInfo({ profile }) {
//   const [showModal, setShowModal] = useState(false);

//   const bannerUrl = profile?.banner?.url || placeholderBanner;
//   const avatarUrl = profile?.avatar?.url || placeholderAvatar;
//   const name = profile?.name || "Unknown";
//   const email = profile?.email || "Not provided";

//   return (
//     <div className="relative mb-20">
//       {/* Banner */}
//       <img
//         src={bannerUrl}
//         alt={profile?.banner?.alt || "User banner"}
//         className="w-full h-48 object-cover rounded-lg"
//       />

//       {/* Avatar and User Info */}
//       <div className="flex items-center gap-6 absolute left-6 -bottom-12 bg-white p-4 rounded-lg shadow-lg">
//         <img
//           src={avatarUrl}
//           alt={profile?.avatar?.alt || "User avatar"}
//           className="w-24 h-24 rounded-full object-cover border-4 border-white"
//         />
//         <div>
//           <h1 className="text-xl font-bold">{name}</h1>
//           <p className="text-gray-600 text-sm">{email}</p>

//           {/* Edit button below email */}
//           <button
//             onClick={() => setShowModal(true)}
//             className="text-blue-600 text-sm mt-2 hover:underline underline-offset-4"
//           >
//             Edit Profile
//           </button>
//         </div>
//       </div>

//       {/* Modal for edit form */}
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
//         <EditProfileForm
//           profile={profile}
//           onClose={() => setShowModal(false)}
//           onUpdated={() => {
//             setTimeout(() => {
//               window.location.reload();
//             }, 2000);
//           }}
//         />
//       </Modal>
//     </div>
//   );
// }
