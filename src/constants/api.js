export const API_BASE = "https://v2.api.noroff.dev";
export const API_AUTH = `${API_BASE}/auth`;
export const API_PROFILES = `${API_BASE}/holidaze/profiles`;

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

  return response.json();
}
