import { apiRequest, API_BOOKINGS, API_PROFILES } from "../../constants/api";

/** Create a booking */
export async function createBooking({ dateFrom, dateTo, guests, venueId }) {
  const payload = {
    dateFrom: new Date(dateFrom).toISOString(),
    dateTo: new Date(dateTo).toISOString(),
    guests: Number(guests),
    venueId,
  };

  return apiRequest(API_BOOKINGS, "POST", payload);
}

/** Update a booking */
export async function updateBooking(id, { dateFrom, dateTo, guests }) {
  const payload = {};
  if (dateFrom) payload.dateFrom = new Date(dateFrom).toISOString();
  if (dateTo) payload.dateTo = new Date(dateTo).toISOString();
  if (typeof guests === "number") payload.guests = guests;

  return apiRequest(`${API_BOOKINGS}/${id}`, "PUT", payload);
}

/** Delete a booking */
export async function deleteBooking(id) {
  return apiRequest(`${API_BOOKINGS}/${id}`, "DELETE");
}

/** Get current user's bookings with venue details */
export async function getMyBookings() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.name) throw new Error("No logged-in user found.");
  return apiRequest(`${API_PROFILES}/${user.name}/bookings?_venue=true`);
}
