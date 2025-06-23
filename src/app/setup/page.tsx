"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SetupPage() {
  const [status, setStatus] = useState<"loading" | "complete" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSetup = async () => {
      try {
        setStatus("loading");
        setMessage("Checking setup status...");

        const response = await fetch("/api/setup", {
          method: "GET",
        });

        const data = await response.json();

        if (response.ok) {
          if (data.setupComplete) {
            setStatus("complete");
            setMessage("Setup already completed. Admin user exists.");
          } else {
            setStatus("error");
            setMessage(`Setup required. No admin user found.

To create your first admin user, run this command in your terminal:

npm run setup

This will guide you through creating your admin user securely.

Alternatively, you can set these environment variables and restart the app:
- DEFAULT_ADMIN_EMAIL
- DEFAULT_ADMIN_USERNAME  
- DEFAULT_ADMIN_NAME
- DEFAULT_ADMIN_PASSWORD`);
          }
        } else {
          setStatus("error");
          setMessage(`Setup check failed: ${data.error || "Unknown error"}`);
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          `Setup check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    };

    checkSetup();
  }, []);

  const handleGoToLogin = () => {
    router.push("/login");
  };

  const handleGoToStudio = () => {
    router.push("/studio");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup</h1>
          <p className="text-gray-600">Checking your setup status...</p>
        </div>

        <div className="mt-8">
          {status === "loading" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === "complete" && (
            <div className="text-center">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800">{message}</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleGoToLogin}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Login
                </button>
                <button
                  onClick={handleGoToStudio}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Go to Studio
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="text-orange-600 text-6xl mb-4">!</div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <pre className="text-sm text-orange-800 whitespace-pre-wrap text-left">
                  {message}
                </pre>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Check Again
                </button>
                <Link
                  href="/"
                  className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-center"
                >
                  Go Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
