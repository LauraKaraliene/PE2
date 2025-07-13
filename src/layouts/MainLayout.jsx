import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="pt-20 px-4">
        <Outlet />
      </main>
    </>
  );
}
