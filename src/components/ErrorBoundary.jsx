import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
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
