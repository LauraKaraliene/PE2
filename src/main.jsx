/**
 * Application entry point.
 *
 * - Renders the root `App` component into the DOM.
 * - Wraps the application in `StrictMode` to highlight potential issues in development.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
