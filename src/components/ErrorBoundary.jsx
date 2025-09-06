/**
 * Error boundary component.
 *
 * - Catches JavaScript errors in child components and displays a fallback UI.
 * - Prevents the entire application from crashing due to uncaught errors.
 * - Logs error details to the console for debugging.
 *
 * @extends {React.Component}
 * @property {boolean} state.hasError - Indicates whether an error has been caught.
 * @returns {JSX.Element} The fallback UI if an error is caught, or the child components otherwise.
 */

import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  /**
   * Updates the state when an error is caught.
   *
   * @returns {object} The updated state with `hasError` set to `true`.
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * Logs the error and additional information to the console.
   *
   * @param {Error} error - The error that was thrown.
   * @param {object} info - Additional information about the error.
   */
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-sm">Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
