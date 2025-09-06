/**
 * Authentication layout component.
 *
 * - Provides a consistent layout for authentication-related pages.
 * - Includes a `Toaster` for displaying notifications.
 * - Centers the child content vertically and horizontally.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The content to render inside the layout.
 * @returns {JSX.Element} The rendered authentication layout component.
 */

import Toaster from "../components/ui/Toaster";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
