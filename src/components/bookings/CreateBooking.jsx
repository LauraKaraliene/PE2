import { API_BOOKINGS, API_PROFILES } from "../../constants/api";
import { apiRequest } from "../../utils/http";

function toISODateTime(s) {
  if (!s) return s;
  if (typeof s === "string" && s.includes("T")) return s;
  return `${s}T00:00:00.000Z`;
}

/** Create a booking */
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

/** Update a booking */
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

/** Delete a booking */
export async function deleteBooking(id) {
  return apiRequest(`${API_BOOKINGS}/${id}`, { method: "DELETE" });
}

/** Get user's bookings */
export async function getMyBookings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user?.name) {
    throw new Error("User not logged in. Please log in to view bookings.");
  }
  return apiRequest(`${API_PROFILES}/${user.name}/bookings?_venue=true`);
}
