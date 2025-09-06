/**
 * API endpoint constants.
 *
 * - Provides base URLs for interacting with the application's backend.
 * - Ensures consistency and avoids hardcoding API URLs throughout the codebase.
 */

export const API_BASE = import.meta.env.VITE_API_BASE;
export const API_AUTH = `${API_BASE}/auth`;
export const API_PROFILES = `${API_BASE}/holidaze/profiles`;
export const API_VENUES = `${API_BASE}/holidaze/venues`;
export const API_BOOKINGS = `${API_BASE}/holidaze/bookings`;
