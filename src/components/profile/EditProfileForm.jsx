import { useForm } from "react-hook-form";
import { useState } from "react";
import { API_PROFILES } from "../../constants/api";
import { apiRequest } from "../../utils/http";

export default function EditProfileForm({ profile, onClose, onUpdated }) {
  const [bannerMsg, setBannerMsg] = useState({ message: "", type: "" });

  const {
    register,
    handleSubmit,
    reset,
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

  async function onSubmit(data) {
    setBannerMsg({ message: "", type: "" });

    const payload = {};
    if (data.bio?.trim()) {
      payload.bio = data.bio.trim();
    }

    // avatar
    if (data.avatarUrl && data.avatarAlt) {
      try {
        const res = await fetch(data.avatarUrl, { method: "HEAD" });
        if (res.ok) {
          payload.avatar = {
            url: data.avatarUrl,
            alt: data.avatarAlt,
          };
        } else {
          setBannerMsg({ message: "Invalid avatar URL", type: "error" });
          return;
        }
      } catch (error) {
        setBannerMsg({ message: "Cannot access avatar URL", type: "error" });
        return;
      }
    }

    // banner
    if (data.bannerUrl && data.bannerAlt) {
      try {
        const res = await fetch(data.bannerUrl, { method: "HEAD" });
        if (res.ok) {
          payload.banner = {
            url: data.bannerUrl,
            alt: data.bannerAlt,
          };
        } else {
          setBannerMsg({ message: "Invalid banner URL", type: "error" });
          return;
        }
      } catch (error) {
        setBannerMsg({ message: "Cannot access banner URL", type: "error" });
        return;
      }
    }

    if (Object.keys(payload).length === 0) {
      setBannerMsg({
        message: "Please fill in at least one field",
        type: "error",
      });
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const result = await apiRequest(
        `${API_PROFILES}/${user.name}`,
        "PUT",
        payload
      );

      setBannerMsg({ message: "Profile updated!", type: "success" });
      onUpdated();
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error("Profile update error:", error);
      setBannerMsg({ message: "Profile update failed", type: "error" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {bannerMsg.message && (
        <div
          className={`text-center py-2 text-sm rounded ${
            bannerMsg.type === "success"
              ? "bg-[color:var(--color-accent)] text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {bannerMsg.message}
        </div>
      )}
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
