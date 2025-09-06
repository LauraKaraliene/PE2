import { API_BASE } from "../constants/api";

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message || "Unexpected error");
    this.name = "ApiError";
    this.status = status ?? 0;
    this.details = details;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const { method = "GET", body } = options;

  const token = localStorage.getItem("accessToken");
  const apiKey = import.meta.env.VITE_API_KEY;

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (apiKey) headers["X-Noroff-API-Key"] = apiKey;

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to detect JSON
  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");

  if (!res.ok) {
    let details = null;

    if (isJson) {
      try {
        details = await res.json();
      } catch {
        // ignore JSON parse errors
      }
    } else {
      try {
        const text = await res.text();
        if (text) details = { message: text };
      } catch {
        // ignore text parse errors
      }
    }

    // fallback messages
    const friendly =
      res.status === 401
        ? "You need to log in to do that."
        : res.status === 403
        ? "You don't have permission for this action."
        : res.status === 404
        ? "Not found."
        : res.status === 422
        ? "Validation error. Please check your input."
        : "Something went wrong. Please try again.";

    const message =
      details?.errors?.[0]?.message || details?.message || friendly;

    throw new ApiError(res.status, message, details);
  }

  if (res.status === 204) return null;
  if (isJson) return res.json();
  return null;
}
