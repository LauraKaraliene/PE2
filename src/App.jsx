import "./styles/index.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { SearchProvider } from "./context/SearchContext";

export default function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <AppRouter />
      </SearchProvider>
    </BrowserRouter>
  );
}
