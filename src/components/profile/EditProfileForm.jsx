import { useForm } from "react-hook-form";
import { useState } from "react";
import { API_PROFILES, apiRequest } from "../../constants/api";

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
    }

    // banner
    if (data.bannerUrl && data.bannerAlt) {
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

      const token = localStorage.getItem("accessToken");

      // Debug log
      console.log("🧪 FULL DEBUG:", {
        token: localStorage.getItem("accessToken"),
        endpoint: `${API_PROFILES}/${user.name}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // debug
      console.log("🚨 Final URL:", `${API_PROFILES}/${user.name}`);

      const result = await fetch(`${API_PROFILES}/${user.name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!result.ok) throw new Error("Profile update failed");

      setBannerMsg({ message: "Profile updated!", type: "success" });
      onUpdated(); // refetch profile
      setTimeout(onClose, 1000);
    } catch (error) {
      setBannerMsg({ message: error.message, type: "error" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {bannerMsg.message && (
        <div
          className={`text-center py-2 text-sm rounded ${
            bannerMsg.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {bannerMsg.message}
        </div>
      )}
      <p className="text-sm mt-6 text-green-900 mb-1">
        Please type in your Avatar URL and Alt text:
      </p>
      <input
        type="url"
        placeholder="Avatar URL"
        {...register("avatarUrl")}
        className="w-full border border-gray-300 p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Avatar Alt Text"
        {...register("avatarAlt")}
        className="w-full border border-gray-300 text-sm p-2 rounded"
      />
      <p className="text-sm mt-4 text-green-900 mb-1">
        Please type in your Banner URL and Alt text:
      </p>
      <input
        type="url"
        placeholder="Banner URL"
        {...register("bannerUrl")}
        className="w-full border border-gray-300 p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Banner Alt"
        {...register("bannerAlt")}
        className="w-full border border-gray-300 p-2 rounded text-sm"
      />

      <button type="submit" className="btn btn-primary mt-4 w-full">
        Save Changes
      </button>
    </form>
  );
}
