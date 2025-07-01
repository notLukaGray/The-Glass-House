"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "button" | "link" | "icon";
}

export default function LogoutButton({
  className = "",
  children,
  variant = "button",
}: LogoutButtonProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch {
      setIsLoading(false);
    }
  };

  if (variant === "link") {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`text-blue-600 hover:text-blue-800 underline ${className}`}
      >
        {isLoading ? "Signing out..." : children || "Sign Out"}
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`p-2 rounded-full hover:bg-gray-100 ${className}`}
        title="Sign Out"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? "Signing out..." : children || "Sign Out"}
    </button>
  );
}
