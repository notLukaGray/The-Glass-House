"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/lib/sanity/config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSettings } from "@/components/providers/SettingsProvider";

export default function StudioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { settings, currentTheme } = useSettings();

  // Memoize theme colors to prevent recalculations on every render
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

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login?callbackUrl=/studio");
      return;
    }

    if (session.user.role !== "admin") {
      router.replace("/403");
      return;
    }
  }, [session, status, router]);

  // Show themed loading while checking authentication
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
            Loading Studio...
          </p>
        </div>
      </main>
    );
  }

  // Show themed redirecting state if not authenticated
  if (!session || session.user.role !== "admin") {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: themeColors.background }}
      >
        <div className="text-center">
          <div
            className="animate-pulse rounded-full h-8 w-8 mx-auto mb-4"
            style={{ backgroundColor: themeColors.accent }}
          ></div>
          <p className="mt-2" style={{ color: themeColors.text }}>
            Redirecting to login...
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
