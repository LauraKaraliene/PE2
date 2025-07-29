import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function MainLayout() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        {/* Search bar for small screens only */}
        <div className="block sm:hidden px-4">
          <SearchBar />
        </div>
        <main className="flex-grow pt-20 px-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
