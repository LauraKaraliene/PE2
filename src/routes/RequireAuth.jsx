import { Navigate, useLocation } from "react-router-dom";
import { useNotify } from "../store/notifications";

export default function RequireAuth({ children }) {
  const loc = useLocation();
  const notify = useNotify((s) => s.push);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthed = !!user?.accessToken;

  if (!isAuthed) {
    notify({ type: "error", message: "Please log in to continue." });
    const returnTo = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  return children;
}
