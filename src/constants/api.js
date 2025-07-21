export const API_BASE = "https://v2.api.noroff.dev";
export const API_AUTH = `${API_BASE}/auth`;

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null,
  apiKey = null
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (apiKey) headers["X-API-Key"] = apiKey;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) throw new Error("API error");

  return response.json();
}
