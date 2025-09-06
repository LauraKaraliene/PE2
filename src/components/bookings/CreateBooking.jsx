import { API_BOOKINGS, API_PROFILES } from "../../constants/api";
import { apiRequest } from "../../utils/http";

/**
 * Converts a date to ISO 8601 format with a time component.
 *
 * @param {string|Date} s - The date to convert.
 * @returns {string} The ISO 8601 formatted date string.
 */
function toISODateTime(s) {
  if (!s) return s;
  if (typeof s === "string" && s.includes("T")) return s;
  return `${s}T00:00:00.000Z`;
}

/**
 * Creates a new booking.
 *
 * @async
 * @function createBooking
 * @param {object} bookingData - The booking details.
 * @param {string|Date} bookingData.dateFrom - The start date of the booking.
 * @param {string|Date} bookingData.dateTo - The end date of the booking.
 * @param {number} bookingData.guests - The number of guests.
 * @param {string} bookingData.venueId - The ID of the venue.
 * @returns {Promise<object>} The created booking data.
 */
export default async function createBooking({
  dateFrom,
  dateTo,
  guests,
  venueId,
}) {
  const payload = {
    dateFrom: toISODateTime(dateFrom),
    dateTo: toISODateTime(dateTo),
    guests: Number(guests),
    venueId,
  };

  const res = await apiRequest(API_BOOKINGS, {
    method: "POST",
    body: payload,
  });

  return res?.data;
}

/**
 * Updates an existing booking.
 *
 * @async
 * @function updateBooking
 * @param {string} id - The ID of the booking to update.
 * @param {object} bookingData - The updated booking details.
 * @param {string|Date} [bookingData.dateFrom] - The updated start date.
 * @param {string|Date} [bookingData.dateTo] - The updated end date.
 * @param {number} [bookingData.guests] - The updated number of guests.
 * @returns {Promise<object>} The updated booking data.
 */
export async function updateBooking(id, { dateFrom, dateTo, guests }) {
  const payload = {};
  if (dateFrom) payload.dateFrom = toISODateTime(dateFrom);
  if (dateTo) payload.dateTo = toISODateTime(dateTo);
  if (typeof guests === "number") payload.guests = guests;

  const res = await apiRequest(`${API_BOOKINGS}/${id}`, {
    method: "PUT",
    body: payload,
  });

  return res?.data;
}

/**
 * Deletes a booking.
 *
 * @async
 * @function deleteBooking
 * @param {string} id - The ID of the booking to delete.
 * @returns {Promise<void>} Resolves when the booking is deleted.
 */
export async function deleteBooking(id) {
  return apiRequest(`${API_BOOKINGS}/${id}`, { method: "DELETE" });
}

/**
 * Fetches the logged-in user's bookings.
 *
 * @async
 * @function getMyBookings
 * @returns {Promise<object>} The user's bookings, including venue details.
 * @throws {Error} Throws an error if the user is not logged in.
 */
export async function getMyBookings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user?.name) {
    throw new Error("User not logged in. Please log in to view bookings.");
  }
  return apiRequest(`${API_PROFILES}/${user.name}/bookings?_venue=true`);
}
