import { useEffect } from "react";
import { useNotify } from "../../store/notifications";

export default function Toaster() {
  const { list, remove } = useNotify();

  useEffect(() => {
    const timers = list.map((t) => setTimeout(() => remove(t.id), t.duration));
    return () => timers.forEach(clearTimeout);
  }, [list, remove]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {list.map((t) => (
        <div
          key={t.id}
          className={`rounded-2xl shadow p-4 w-80 border
          ${
            t.type === "success"
              ? "bg-green-50 border-green-200"
              : t.type === "error"
              ? "bg-red-50 border-red-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="text-sm">{t.message}</div>
        </div>
      ))}
    </div>
  );
}
