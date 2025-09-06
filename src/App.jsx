/**
 * Root component of the application.
 *
 * - Wraps the application in essential providers (`FavoritesProvider`, `SearchProvider`).
 * - Sets up routing using `BrowserRouter`.
 * - Provides global error handling with `ErrorBoundary`.
 *
 * @returns {JSX.Element} The application wrapped with providers and routing.
 */

import "./styles/index.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { SearchProvider } from "./context/SearchContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <FavoritesProvider>
          <SearchProvider>
            <AppRouter />
          </SearchProvider>
        </FavoritesProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
