/**
 * Zustand store for managing notifications.
 *
 * - Allows adding, removing, and clearing notifications.
 * - Each notification has a unique ID, type, message, and optional duration.
 *
 * @module notifications
 */

import { create } from "zustand";

let id = 0;

/**
 * Zustand store for notifications.
 *
 * @typedef {object} Notification
 * @property {number} id - Unique identifier for the notification.
 * @property {string} type - The type of the notification (e.g., "info", "success", "error").
 * @property {string} message - The message to display in the notification.
 * @property {number} [duration=4000] - The duration (in milliseconds) the notification is displayed.
 *
 * @typedef {object} NotificationStore
 * @property {Notification[]} list - The list of active notifications.
 * @property {function(Notification):void} push - Adds a new notification to the list.
 * @property {function(number):void} remove - Removes a notification by its ID.
 * @property {function():void} clear - Clears all notifications.
 *
 * @returns {NotificationStore} The Zustand store for notifications.
 */
export const useNotify = create((set) => ({
  list: [],
  /**
   * Adds a new notification to the list.
   *
   * @param {object} n - The notification to add.
   * @param {string} n.type - The type of the notification (e.g., "info", "success", "error").
   * @param {string} n.message - The message to display in the notification.
   * @param {number} [n.duration=4000] - The duration (in milliseconds) the notification is displayed.
   */
  push: (n) =>
    set((s) => ({
      list: [
        ...s.list,
        {
          id: ++id,
          type: n.type || "info",
          message: n.message,
          duration: n.duration ?? 4000,
        },
      ],
    })),
  /**
   * Removes a notification by its ID.
   *
   * @param {number} id - The ID of the notification to remove.
   */
  remove: (id) => set((s) => ({ list: s.list.filter((t) => t.id !== id) })),
  /**
   * Clears all notifications.
   */
  clear: () => set({ list: [] }),
}));
