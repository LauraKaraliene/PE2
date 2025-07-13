import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SingleVenue from "../pages/SingleVenue";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venue/:id" element={<SingleVenue />} />
    </Routes>
  );
}
