/**
 * Login form component.
 *
 * - Handles user authentication by submitting login credentials to the API.
 * - Validates form inputs (email and password) using `react-hook-form`.
 * - Displays error messages for invalid inputs or failed login attempts.
 * - Redirects authenticated users to their profile or a specified return URL.
 *
 * @returns {JSX.Element} The rendered login form.
 */

import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { API_AUTH } from "../../constants/api";
import { apiRequest } from "../../utils/http";
import { useNotify } from "../store/notifications";

export default function LoginForm() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const notify = useNotify((s) => s.push);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  /**
   * Handles form submission.
   *
   * - Sends login credentials to the API.
   * - Stores the access token and user data in `localStorage`.
   * - Redirects the user to their profile or a specified return URL.
   * - Displays a success or error notification based on the response.
   *
   * @param {object} data - The form data containing email and password.
   */
  async function onSubmit(data) {
    try {
      const res = await apiRequest(`${API_AUTH}/login`, {
        method: "POST",
        body: { email: data.email, password: data.password },
      });

      // Persist auth
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data));

      // Toast + redirect
      notify({ type: "success", message: "Welcome back!" });
      const returnTo = sp.get("returnTo") || `/profile/${res.data.name}` || "/";
      navigate(returnTo, { replace: true });
    } catch (e) {
      notify({ type: "error", message: e?.message || "Login failed." });
      reset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-[color:var(--color-background)] rounded-md shadow-md p-8 mt-7"
    >
      <input
        type="email"
        placeholder="Email"
        autoComplete="email"
        autoFocus
        className="w-full border border-[color:var(--color-background-gray)] py-2 px-3 rounded focus:outline-none focus:ring focus:ring-[color:var(--color-accent)] placeholder:text-sm"
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
        autoComplete="current-password"
        className="w-full border border-[color:var(--color-background-gray)] py-2 px-3 rounded focus:outline-none focus:ring focus:ring-[color:var(--color-accent)] placeholder:text-sm"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Minimum 8 characters" },
        })}
      />
      {errors.password && (
        <p className="text-red-600 text-sm">{errors.password.message}</p>
      )}

      <button type="submit" className="btn btn-primary w-full">
        Login
      </button>

      <div className="text-start text-sm space-y-1 pt-2">
        <p>Don’t have an account?</p>
        <Link
          to="/register"
          className="text-[color:var(--color-primary)] hover:underline underline-offset-2 font-medium"
        >
          Register here
        </Link>
      </div>
    </form>
  );
}
