import { useState } from "react";
import { API_AUTH } from "../../constants/api";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_AUTH}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data));
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white rounded-md shadow-md p-8 mt-7"
    >
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        pattern="^[a-zA-Z0-9._%+-]+@stud\\.noroff\\.no$"
        className="w-full border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring focus:ring-green-500"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring focus:ring-green-500"
        autoComplete="current-password"
        minLength="8"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

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
  );
}
