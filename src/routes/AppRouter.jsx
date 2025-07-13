import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import SingleVenue from "../pages/SingleVenue";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/venue/:id" element={<SingleVenue />} />
      </Route>
    </Routes>
  );
}
