import { create } from "zustand";

let id = 0;
export const useNotify = create((set) => ({
  list: [],
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
  remove: (id) => set((s) => ({ list: s.list.filter((t) => t.id !== id) })),
  clear: () => set({ list: [] }),
}));
