/**
 * Main layout component.
 *
 * - Provides a consistent structure for pages, including a header, footer, and main content area.
 * - Includes a search bar visible only on small screens.
 * - Uses `Outlet` to render child routes dynamically.
 * - Displays a `Toaster` for global notifications.
 *
 * @returns {JSX.Element} The rendered layout structure.
 */

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Toaster from "../components/ui/Toaster";

export default function MainLayout() {
  return (
    <>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Header />
        <Toaster />

        {/* Search bar for small screens only */}
        <div className="block sm:hidden px-4">
          <SearchBar className="mt-4" />
        </div>
        <main className="flex-grow pt-10 px-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
