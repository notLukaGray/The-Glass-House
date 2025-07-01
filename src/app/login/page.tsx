"use client";
import { Suspense, useEffect, useState, useMemo } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { validateUsername, validatePassword } from "@/lib/auth/utils";
import { useSettings } from "@/components/providers/SettingsProvider";

function LoginPageInner() {
  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // Hooks for routing, session, and settings
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { settings, currentTheme } = useSettings();

  // Memoize theme colors to prevent recalculations on every render.
  const themeColors = useMemo(() => {
    const colors =
      currentTheme === "dark"
        ? settings?.theme.darkMode.colors
        : settings?.theme.lightMode.colors;
    return {
      background: colors?.background || "#000000",
      text: colors?.text || "#FFFFFF",
      accent: colors?.accent || "#ff00ea",
      secondary: colors?.secondary || "rgba(0, 0, 0, 0.8)",
    };
  }, [currentTheme, settings]);

  // Handle redirects and loading states based on session status.
  useEffect(() => {
    // If the user is already authenticated, redirect them away from the login page.
    if (status === "authenticated" && session) {
      const callbackUrl = searchParams?.get("callbackUrl") || "/";
      router.push(callbackUrl);
    }
  }, [session, status, router, searchParams]);

  // While the session is being checked, show a themed loading indicator.
  if (status === "loading") {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: themeColors.background }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
            style={{ borderColor: themeColors.text }}
          ></div>
          <p className="mt-2" style={{ color: themeColors.text }}>
            Loading...
          </p>
        </div>
      </main>
    );
  }

  // Once authenticated, render nothing to avoid a flash of the login form before redirecting.
  if (status === "authenticated") {
    return null;
  }

  const validateForm = () => {
    const errors: { username?: string; password?: string } = {};

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false, // We handle the redirect manually for a better UX.
      });

      if (res?.ok) {
        const callbackUrl = searchParams?.get("callbackUrl") || "/";
        router.push(callbackUrl);
      } else {
        // Use the specific error message from NextAuth if available, otherwise show a generic one.
        setError(
          res?.error ||
            "Unable to sign in. Please check your connection and try again.",
        );
      }
    } catch {
      setError("A connection error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (validationErrors.username) {
      setValidationErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // Themed styles for the form elements.
  const formStyles = {
    backgroundColor: themeColors.secondary,
    border: `1px solid ${themeColors.text}20`,
  };
  const inputStyles = (hasError: boolean) => ({
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: hasError ? "1px solid #ef4444" : `1px solid ${themeColors.text}30`,
    color: themeColors.text,
  });
  const buttonStyles = {
    backgroundColor: isLoading
      ? "rgba(156, 163, 175, 0.5)"
      : themeColors.accent,
    color: themeColors.text,
    opacity: isLoading ? 0.7 : 1,
    cursor: isLoading ? "not-allowed" : "pointer",
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: themeColors.background }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded shadow-lg w-full max-w-sm space-y-6 backdrop-blur-sm"
        style={formStyles}
      >
        <h1
          className="text-2xl font-bold text-center"
          style={{ color: themeColors.text }}
        >
          Login
        </h1>

        {error && (
          <div
            className="text-center p-3 rounded border"
            style={{
              color: "#ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderColor: "rgba(239, 68, 68, 0.3)",
            }}
          >
            {error}
          </div>
        )}

        <div>
          <label
            className="block mb-1 font-medium"
            style={{ color: themeColors.text }}
          >
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="w-full rounded px-3 py-2 transition-colors"
            style={inputStyles(!!validationErrors.username)}
            required
            autoFocus
            disabled={isLoading}
            placeholder="Enter username"
          />
          {validationErrors.username && (
            <p className="text-red-400 text-sm mt-1">
              {validationErrors.username}
            </p>
          )}
        </div>

        <div>
          <label
            className="block mb-1 font-medium"
            style={{ color: themeColors.text }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full rounded px-3 py-2 transition-colors"
            style={inputStyles(!!validationErrors.password)}
            required
            disabled={isLoading}
            placeholder="Enter password"
          />
          {validationErrors.password && (
            <p className="text-red-400 text-sm mt-1">
              {validationErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 rounded font-semibold transition-all duration-200"
          style={buttonStyles}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            if (!isLoading) e.currentTarget.style.opacity = "1";
          }}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
