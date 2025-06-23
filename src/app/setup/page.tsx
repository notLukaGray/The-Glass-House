"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const setupAdmin = async () => {
      try {
        setStatus("loading");
        setMessage("Setting up admin user...");

        const response = await fetch("/api/setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "setup-admin" }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          setMessage(`Admin user created successfully!
          
Username: ${data.credentials.username}
Password: ${data.credentials.password}

⚠️  IMPORTANT: Change this password after your first login!

You can now login at /login and access the studio at /studio.`);
        } else {
          setStatus("error");
          setMessage(`Setup failed: ${data.error || "Unknown error"}`);
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          `Setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    };

    setupAdmin();
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔐 Admin Setup
          </h1>
          <p className="text-gray-600">
            Setting up your admin user automatically...
          </p>
        </div>

        <div className="mt-8">
          {status === "loading" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="text-green-600 text-6xl mb-4">✅</div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <pre className="text-sm text-green-800 whitespace-pre-wrap text-left">
                  {message}
                </pre>
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
              <div className="text-red-600 text-6xl mb-4">❌</div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{message}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
