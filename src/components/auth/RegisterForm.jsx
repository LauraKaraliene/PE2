import { useState } from "react";
import { API_AUTH } from "../../constants/api";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatarUrl: "",
    avatarAlt: "",
    venueManager: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      avatar: formData.avatarUrl
        ? {
            url: formData.avatarUrl,
            alt: formData.avatarAlt,
          }
        : undefined,
      venueManager: formData.venueManager,
    };

    try {
      const res = await fetch(`${API_AUTH}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Registration failed");

      const data = await res.json();
      setSuccess("Account created! You can now log in.");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-center">Register</h2>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        name="email"
        placeholder="Email"
        pattern="^[a-zA-Z0-9._%+-]+@stud\\.noroff\\.no$"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        name="avatarUrl"
        placeholder="Avatar URL (optional)"
        value={formData.avatarUrl}
        onChange={handleChange}
        className="input"
      />
      <input
        name="avatarAlt"
        placeholder="Avatar Alt Text (optional)"
        value={formData.avatarAlt}
        onChange={handleChange}
        className="input"
      />
      <label className="flex items-center">
        <input
          type="checkbox"
          name="venueManager"
          checked={formData.venueManager}
          onChange={handleChange}
        />
        <span className="ml-2 text-sm">
          Venue Manager (I will be renting my property)
        </span>
      </label>
      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>
    </form>
  );
}
