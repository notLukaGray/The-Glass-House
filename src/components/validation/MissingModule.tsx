import React from "react";
import { z } from "zod";

/**
 * MissingModule component for when data validation fails
 *
 * This component is displayed when critical data is missing or invalid.
 * It provides a user-friendly error message and can include debugging
 * information in development mode.
 */
export function MissingModule({
  moduleName,
  errors,
  showDebug = false,
}: {
  moduleName: string;
  errors?: z.ZodError;
  showDebug?: boolean;
}) {
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
      <h3 className="text-red-800 font-semibold mb-2">
        Missing or Invalid Content: {moduleName}
      </h3>
      <p className="text-red-700 mb-2">
        This content could not be loaded properly. Please check the content
        management system.
      </p>

      {showDebug && errors && (
        <details className="mt-2">
          <summary className="text-red-600 cursor-pointer text-sm">
            Debug Information
          </summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
            {JSON.stringify(errors.errors, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * Generic error boundary component for data validation failures
 *
 * This component can be used to wrap content that might fail validation
 * and provide a consistent error experience.
 */
export function ValidationErrorBoundary({
  children,
  fallback = MissingModule,
  moduleName = "Content",
}: {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ moduleName: string; errors?: z.ZodError }>;
  moduleName?: string;
}) {
  try {
    return <>{children}</>;
  } catch (error) {
    const FallbackComponent = fallback;
    return (
      <FallbackComponent
        moduleName={moduleName}
        errors={error instanceof z.ZodError ? error : undefined}
      />
    );
  }
}
