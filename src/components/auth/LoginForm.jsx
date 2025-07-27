import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_AUTH } from "../../constants/api";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [banner, setBanner] = useState({ message: "", type: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data) {
    setBanner({ message: "", type: "" });

    try {
      const res = await fetch(`${API_AUTH}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const result = await res.json();
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("user", JSON.stringify(result.data));

      setBanner({ message: "Login successful!", type: "success" });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setBanner({ message: err.message, type: "error" });

      // Clear banner and form after 3 sec
      setTimeout(() => {
        setBanner({ message: "", type: "" });
        reset();
      }, 3000);
    }
  }

  return (
    <>
      {/* Slide-down banner */}
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
          type="email"
          placeholder="Email"
          autoComplete="email"
          autoFocus
          className="w-full border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring focus:ring-green-500 placeholder:text-sm"
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
          className="w-full border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring focus:ring-green-500 placeholder:text-sm"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
          })}
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}

        <button type="submit" className="btn-primary w-full">
          Login
        </button>

        <div className="text-start text-sm space-y-1 pt-2">
          <p>Don’t have an account?</p>
          <Link
            to="/register"
            className="text-green-800 hover:underline underline-offset-2 font-medium"
          >
            Register here
          </Link>
        </div>
      </form>
    </>
  );
}
