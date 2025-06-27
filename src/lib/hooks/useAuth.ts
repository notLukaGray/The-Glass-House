"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

// Extend the NextAuth session user type
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export interface UseAuthReturn {
  // Session state
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ExtendedUser | undefined;

  // Authentication actions
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  // Role checking
  hasRole: (role: string) => boolean;
  isAdmin: boolean;

  // Protection utilities
  requireAuth: (callback?: () => void) => void;
  requireRole: (role: string, callback?: () => void) => void;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = !!session;
  const isLoading = status === "loading";
  const user = session?.user as ExtendedUser | undefined;

  const login = useCallback(async (username: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error:
            result?.error === "CredentialsSignin"
              ? "Invalid username or password"
              : "An error occurred during login",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user?.role],
  );

  const isAdmin = hasRole("admin");

  const requireAuth = useCallback(
    (callback?: () => void) => {
      if (!isAuthenticated && !isLoading) {
        router.push("/login");
        return;
      }
      callback?.();
    },
    [isAuthenticated, isLoading, router],
  );

  const requireRole = useCallback(
    (role: string, callback?: () => void) => {
      if (!isAuthenticated && !isLoading) {
        router.push("/login");
        return;
      }

      if (!hasRole(role)) {
        router.push("/403");
        return;
      }

      callback?.();
    },
    [isAuthenticated, isLoading, hasRole, router],
  );

  return {
    session,
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    hasRole,
    isAdmin,
    requireAuth,
    requireRole,
  };
}
