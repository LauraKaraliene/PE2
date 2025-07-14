import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 px-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
