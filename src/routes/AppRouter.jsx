import { Navigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import SingleVenue from "../pages/SingleVenue";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProfilePage from "../pages/ProfilePage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Main routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/venues/:id" element={<SingleVenue />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Route>

      {/* Auth routes (no MainLayout) */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
