"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

/**
 * A simple wrapper component for the NextAuth `SessionProvider`.
 *
 * The `SessionProvider` from `next-auth/react` uses the `useContext` hook,
 * which means it must be a Client Component. However, we want to use it
 * in our root layout, which is a Server Component.
 *
 * This wrapper component solves that problem. By marking this file with
 * `"use client"`, we create a client-side boundary. We can then import
 * this wrapper into our server-side `layout.tsx` without issue.
 *
 * It's a common and recommended pattern for integrating context providers
 * that rely on client-side hooks into the App Router.
 */
export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
