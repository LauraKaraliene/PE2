import "./styles/index.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { SearchProvider } from "./context/SearchContext";
import { FavoritesProvider } from "./context/FavoritesContext";

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <SearchProvider>
          <AppRouter />
        </SearchProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
}
