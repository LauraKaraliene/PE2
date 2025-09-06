import { API_BASE } from "../constants/api";

/**
 * Custom error class for API-related errors.
 *
 * @class ApiError
 * @extends Error
 * @property {number} status - HTTP status code of the error.
 * @property {string} message - Error message.
 * @property {object|null} details - Additional details about the error (e.g., response body).
 */
export class ApiError extends Error {
  constructor(status, message, details) {
    super(message || "Unexpected error");
    this.name = "ApiError";
    this.status = status ?? 0;
    this.details = details;
  }
}

/**
 * Makes an API request to the specified endpoint.
 *
 * @async
 * @function apiRequest
 * @param {string} endpoint - The API endpoint to call (relative or absolute URL).
 * @param {object} [options={}] - Options for the request.
 * @param {string} [options.method="GET"] - HTTP method (e.g., "GET", "POST").
 * @param {object|null} [options.body=null] - Request body (will be JSON-stringified).
 * @returns {Promise<any>} The parsed JSON response, or `null` for empty responses.
 * @throws {ApiError} Throws an `ApiError` if the response is not successful.
 */
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
