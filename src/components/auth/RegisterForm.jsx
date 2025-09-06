/**
 * Registration form component.
 *
 * - Handles user registration by submitting form data to the API.
 * - Validates form inputs (name, email, password, avatar URL, etc.) using `react-hook-form`.
 * - Displays error messages for invalid inputs or failed registration attempts.
 * - Redirects users to the login page upon successful registration.
 *
 * @returns {JSX.Element} The rendered registration form.
 */

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { API_AUTH } from "../../constants/api";
import { apiRequest } from "../../utils/http";
import { useNotify } from "../store/notifications";

export default function RegisterForm() {
  const navigate = useNavigate();
  const notify = useNotify((s) => s.push);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  /**
   * Handles form submission.
   *
   * - Sends registration data to the API.
   * - Validates the avatar URL if provided.
   * - Displays success or error notifications based on the response.
   *
   * @param {object} form - The form data containing user details.
   */
  async function onSubmit(form) {
    // Build payload
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      venueManager: !!form.venueManager,
    };

    if (form.avatarUrl && form.avatarAlt) {
      try {
        const res = await fetch(form.avatarUrl, { method: "HEAD" });
        if (!res.ok) throw new Error("Avatar URL is unreachable.");
        payload.avatar = { url: form.avatarUrl, alt: form.avatarAlt };
      } catch (e) {
        notify({ type: "error", message: e?.message || "Invalid avatar URL." });
        reset({ ...form, avatarUrl: "", avatarAlt: "" });
        return;
      }
    }

    try {
      await apiRequest(`${API_AUTH}/register`, {
        method: "POST",
        body: payload,
      });

      // Success + toast + go to login
      notify({ type: "success", message: "Account created! Please log in." });
      navigate("/login", { replace: true });
    } catch (e) {
      notify({ type: "error", message: e?.message || "Registration failed." });
      reset({ ...form, password: "", confirmPassword: "" });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-[color:var(--color-background)] rounded-md shadow-md p-8 mt-7"
    >
      <input
        type="text"
        placeholder="Name"
        className="input w-full border border-[color:var(--color-background-gray)] py-2 px-3 rounded focus:outline-none focus:ring focus:ring-[color:var(--color-accent)] placeholder:text-sm"
        {...register("name", {
          required: "Name is required",
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: "Only letters, numbers, and underscores allowed",
          },
        })}
      />
      {errors.name && (
        <p className="text-red-600 text-sm">{errors.name.message}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        className="input w-full border border-[color:var(--color-background-gray)] py-2 px-3 rounded focus:outline-none focus:ring focus:ring-[color:var(--color-accent)] placeholder:text-sm"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/,
            message: "Must be a stud.noroff.no email",
          },
        })}
      />
      {errors.email && (
        <p className="text-red-600 text-sm">{errors.email.message}</p>
      )}

      <input
        type="password"
        placeholder="Password"
        className="input w-full border border-[color:var(--color-background-gray)] py-2 px-3 rounded focus:outline-none focus:ring focus:ring-[color:var(--color-accent)] placeholder:text-sm"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Minimum 8 characters" },
        })}
      />
      {errors.password && (
        <p className="text-red-600 text-sm">{errors.password.message}</p>
      )}

      <input
        type="password"
        placeholder="Confirm Password"
        className="input w-full border border-[color:var(--color-background-gray)] py-2 px-3 rounded focus:outline-none focus:ring focus:ring-[color:var(--color-accent)] placeholder:text-sm"
        {...register("confirmPassword", {
          required: "Confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
      />
      {errors.confirmPassword && (
        <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
      )}

      <input
        type="url"
        placeholder="Avatar URL (optional)"
        className="input w-full border border-[color:var(--color-background-gray)] py-2 px-3 rounded focus:outline-none focus:ring focus:ring-[color:var(--color-accent)] placeholder:text-sm"
        {...register("avatarUrl", {
          pattern: { value: /^https?:\/\/.+/i, message: "Must be a valid URL" },
        })}
      />
      {errors.avatarUrl && (
        <p className="text-red-600 text-sm">{errors.avatarUrl.message}</p>
      )}

      <input
        type="text"
        placeholder="Avatar Alt Text (optional)"
        className="input w-full border border-[color:var(--color-background-gray)] py-2 px-3 rounded focus:outline-none focus:ring focus:ring-[color:var(--color-accent)] placeholder:text-sm"
        {...register("avatarAlt", {
          maxLength: { value: 120, message: "Max 120 characters" },
        })}
      />
      {errors.avatarAlt && (
        <p className="text-red-600 text-sm">{errors.avatarAlt.message}</p>
      )}

      <label className="flex items-start space-x-2">
        <input type="checkbox" {...register("venueManager")} className="mt-1" />
        <span className="text-sm leading-tight">
          Venue Manager <br />
          (I will be renting my property)
        </span>
      </label>

      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>
    </form>
  );
}
