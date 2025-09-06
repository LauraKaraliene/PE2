/**
 * Edit profile form component.
 *
 * - Allows users to update their profile information, including bio, avatar, and banner.
 * - Validates URLs for avatar and banner images before submission.
 * - Displays success or error messages based on the result of the update.
 *
 * @param {object} props - Component props.
 * @param {object} props.profile - The current profile data to prefill the form.
 * @param {string} [props.profile.bio] - The user's bio.
 * @param {object} [props.profile.avatar] - The user's avatar data.
 * @param {string} [props.profile.avatar.url] - The URL of the avatar image.
 * @param {string} [props.profile.avatar.alt] - The alt text for the avatar image.
 * @param {object} [props.profile.banner] - The user's banner data.
 * @param {string} [props.profile.banner.url] - The URL of the banner image.
 * @param {string} [props.profile.banner.alt] - The alt text for the banner image.
 * @param {function} props.onClose - Callback function to close the form.
 * @param {function} props.onUpdated - Callback function to refresh the profile after a successful update.
 * @returns {JSX.Element} The rendered edit profile form.
 */

import { useForm } from "react-hook-form";
import { API_PROFILES } from "../../constants/api";
import { apiRequest } from "../../utils/http";
import { useNotify } from "../store/notifications";

export default function EditProfileForm({ profile, onClose, onUpdated }) {
  const notify = useNotify();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: profile.bio || "",
      avatarUrl: profile.avatar?.url || "",
      avatarAlt: profile.avatar?.alt || "",
      bannerUrl: profile.banner?.url || "",
      bannerAlt: profile.banner?.alt || "",
    },
  });

  /**
   * Handles form submission.
   *
   * - Validates and prepares the payload for the API request.
   * - Sends the updated profile data to the server.
   * - Displays success or error messages based on the response.
   *
   * @param {object} data - The form data containing updated profile fields.
   */
  async function onSubmit(data) {
    const payload = {};
    if (data.bio?.trim()) payload.bio = data.bio.trim();

    // Validate avatar URL
    if (data.avatarUrl && data.avatarAlt) {
      try {
        const res = await fetch(data.avatarUrl, {
          method: "HEAD",
          mode: "no-cors",
        });
        payload.avatar = { url: data.avatarUrl, alt: data.avatarAlt };
      } catch {
        notify.push({
          type: "error",
          message: "Invalid or unreachable avatar URL",
        });
        return;
      }
    } else if (data.avatarUrl || data.avatarAlt) {
      notify.push({
        type: "error",
        message: "Avatar URL and Alt are both required",
      });
      return;
    }

    // Validate banner URL
    if (data.bannerUrl && data.bannerAlt) {
      try {
        const res = await fetch(data.bannerUrl, {
          method: "HEAD",
          mode: "no-cors",
        });
        payload.banner = { url: data.bannerUrl, alt: data.bannerAlt };
      } catch {
        notify.push({
          type: "error",
          message: "Invalid or unreachable banner URL",
        });
        return;
      }
    } else if (data.bannerUrl || data.bannerAlt) {
      notify.push({
        type: "error",
        message: "Banner URL and Alt are both required",
      });
      return;
    }

    if (!Object.keys(payload).length) {
      notify.push({
        type: "error",
        message: "Please change at least one field",
      });
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.name) {
        notify.push({
          type: "error",
          message: "You must be logged in to update profile",
        });
        return;
      }

      await apiRequest(
        `${API_PROFILES}/${user.name.toLowerCase()}`,
        "PUT",
        payload
      );

      notify.push({ type: "success", message: "Profile updated!" });
      onUpdated?.();
      setTimeout(onClose, 100);
    } catch (err) {
      console.error("Profile update error:", err);
      notify.push({ type: "error", message: "Profile update failed" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm mt-6 text-[color:var(--color-primary)] mb-1">
        Please type in your Avatar URL and Alt text:
      </p>
      <input
        type="url"
        placeholder="Avatar URL"
        {...register("avatarUrl")}
        className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Avatar Alt Text"
        {...register("avatarAlt")}
        className="w-full border border-[color:var(--color-background-gray)] text-sm p-2 rounded"
      />

      <p className="text-sm mt-4 text-[color:var(--color-primary)] mb-1">
        Please type in your Banner URL and Alt text:
      </p>
      <input
        type="url"
        placeholder="Banner URL"
        {...register("bannerUrl")}
        className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Banner Alt"
        {...register("bannerAlt")}
        className="w-full border border-[color:var(--color-background-gray)] p-2 rounded text-sm"
      />

      <button type="submit" className="btn btn-primary mt-4 w-full">
        Save Changes
      </button>
    </form>
  );
}
