import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_AUTH } from "../../constants/api";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [banner, setBanner] = useState({ message: "", type: "" });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  async function onSubmit(data) {
    setBanner({ message: "", type: "" });

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      venueManager: data.venueManager || false,
    };

    // 🔎 Validate avatar URL (if provided)
    if (data.avatarUrl && data.avatarAlt) {
      try {
        const res = await fetch(data.avatarUrl, { method: "HEAD" });
        if (!res.ok) {
          throw new Error("Avatar URL is unreachable.");
        }
        payload.avatar = {
          url: data.avatarUrl,
          alt: data.avatarAlt,
        };
      } catch (err) {
        setBanner({ message: err.message, type: "error" });
        setTimeout(() => {
          setBanner({ message: "", type: "" });
          reset();
        }, 3000);
        return;
      }
    }

    try {
      const res = await fetch(`${API_AUTH}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Registration failed");

      const data = await res.json();
      console.log("✅ Registered user:", data);

      // await res.json();
      setBanner({
        message: "Account created! Redirecting...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setBanner({ message: err.message, type: "error" });
      setTimeout(() => {
        setBanner({ message: "", type: "" });
        reset();
      }, 4000);
    }
  }

  return (
    <>
      {banner.message && (
        <div
          className={`fixed top-0 left-0 right-0 text-white text-center py-3 z-50 transition-all duration-300 ${
            banner.type === "success" ? "bg-green-700" : "bg-red-600"
          }`}
        >
          {banner.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white rounded-md shadow-md p-8 mt-7"
      >
        <input
          type="text"
          placeholder="Name"
          {...register("name", {
            required: "Name is required",
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: "Only letters, numbers, and underscores allowed",
            },
          })}
          className="input w-full border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring focus:ring-green-500 placeholder:text-sm"
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/,
              message: "Must be a stud.noroff.no email",
            },
          })}
          className="input w-full border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring focus:ring-green-500 placeholder:text-sm"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
          })}
          className="input w-full border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring focus:ring-green-500 placeholder:text-sm"
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className="input w-full border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring focus:ring-green-500 placeholder:text-sm"
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        <input
          type="url"
          placeholder="Avatar URL (optional)"
          {...register("avatarUrl", {
            pattern: {
              value: /^https?:\/\/.+/i,
              message: "Must be a valid URL",
            },
          })}
          className="input w-full border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring focus:ring-green-500 placeholder:text-sm"
        />
        {errors.avatarUrl && (
          <p className="text-red-600 text-sm">{errors.avatarUrl.message}</p>
        )}

        <input
          type="text"
          placeholder="Avatar Alt Text (optional)"
          {...register("avatarAlt", {
            maxLength: {
              value: 120,
              message: "Max 120 characters",
            },
          })}
          className="input w-full border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring focus:ring-green-500 placeholder:text-sm"
        />
        {errors.avatarAlt && (
          <p className="text-red-600 text-sm">{errors.avatarAlt.message}</p>
        )}

        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            {...register("venueManager")}
            className="mt-1"
          />
          <span className="text-sm leading-tight">
            Venue Manager <br />
            (I will be renting my property)
          </span>
        </label>

        <button type="submit" className="btn-primary w-full">
          Submit
        </button>
      </form>
    </>
  );
}
