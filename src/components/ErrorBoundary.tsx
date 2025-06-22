"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * A generic React Error Boundary component.
 *
 * This component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the crashed component tree.
 * It's a class component because functional components with hooks do not yet have
 * a direct equivalent for the `getDerivedStateFromError` and `componentDidCatch` lifecycles.
 *
 * It is placed in the root layout to catch any potential rendering error across the app,
 * preventing a white screen of death and giving the user a way to recover.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * This lifecycle is invoked after an error has been thrown by a descendant component.
   * It receives the error that was thrown as a parameter and should return a value to update state.
   * @param error The error that was thrown.
   * @returns A new state object.
   */
  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  /**
   * This lifecycle is also invoked after an error has been thrown by a descendant component.
   * It is used for side effects, like logging the error to an external service.
   * @param error The error that was thrown.
   * @param errorInfo An object with a `componentStack` key containing information about which
   * component threw the error.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Standard console log for all environments.
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Example of logging to an external service only in production.
    if (process.env.NODE_ENV === "production") {
      // Replace this with your actual logging service (e.g., Sentry, LogRocket).
      // logErrorToMyService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // A custom fallback UI can be passed as a prop.
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI if no custom one is provided.
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We&apos;re sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Refresh Page
            </button>
            {/* In development, we show the error details to make debugging easier. */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.message}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    // If there's no error, just render the children as normal.
    return this.props.children;
  }
}

export default ErrorBoundary;
