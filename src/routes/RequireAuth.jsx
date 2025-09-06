/**
 * Higher-order component for protecting routes that require authentication.
 *
 * - Checks if the user is authenticated by verifying the presence of an access token.
 * - Redirects unauthenticated users to the login page with a `returnTo` query parameter.
 * - Displays an error notification if the user is not authenticated.
 *
 * @param {object} props - Component props.
 * @param {JSX.Element} props.children - The child components to render if the user is authenticated.
 * @returns {JSX.Element} The child components if authenticated, or a redirect to the login page otherwise.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useNotify } from "../components/store/notifications";

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
