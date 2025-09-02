export const API_BASE = import.meta.env.VITE_API_BASE;
export const API_AUTH = `${API_BASE}/auth`;
export const API_PROFILES = `${API_BASE}/holidaze/profiles`;
export const API_VENUES = `${API_BASE}/holidaze/venues`;
export const API_BOOKINGS = `${API_BASE}/holidaze/bookings`;

export async function apiRequest(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("accessToken");
  const apiKey = import.meta.env.VITE_API_KEY;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (apiKey) headers["X-Noroff-API-Key"] = apiKey;

  const fullUrl = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}${endpoint}`;

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    console.error(`API call failed (${response.status}): ${fullUrl}`);
    throw new Error("API error");
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null;
}
