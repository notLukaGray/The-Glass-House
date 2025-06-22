"use client";

import { useSettings } from "@/components/providers/SettingsProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function TestThemePage() {
  const { settings, currentTheme, isLoading, error } = useSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">
          Error loading settings: {error.message}
        </div>
      </div>
    );
  }

  const themeColors =
    currentTheme === "dark"
      ? settings?.theme.darkMode.colors
      : settings?.theme.lightMode.colors;

  return (
    <div
      className="min-h-screen p-8 transition-colors duration-300"
      style={{ backgroundColor: themeColors?.background }}
    >
      <ThemeToggle />

      <div className="max-w-4xl mx-auto">
        <h1
          className="text-4xl font-bold mb-8"
          style={{ color: themeColors?.text }}
        >
          Theme Test Page
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Settings Info */}
          <div className="space-y-4">
            <h2
              className="text-2xl font-semibold"
              style={{ color: themeColors?.text }}
            >
              Site Settings
            </h2>

            <div className="space-y-2">
              <div>
                <span
                  className="font-medium"
                  style={{ color: themeColors?.primary }}
                >
                  Site Title:
                </span>
                <span className="ml-2" style={{ color: themeColors?.text }}>
                  {settings?.basicInfo.title.en}
                </span>
              </div>

              <div>
                <span
                  className="font-medium"
                  style={{ color: themeColors?.primary }}
                >
                  Description:
                </span>
                <span className="ml-2" style={{ color: themeColors?.text }}>
                  {settings?.basicInfo.description.en}
                </span>
              </div>

              <div>
                <span
                  className="font-medium"
                  style={{ color: themeColors?.primary }}
                >
                  Current Theme:
                </span>
                <span className="ml-2" style={{ color: themeColors?.text }}>
                  {currentTheme}
                </span>
              </div>

              <div>
                <span
                  className="font-medium"
                  style={{ color: themeColors?.primary }}
                >
                  Default Theme:
                </span>
                <span className="ml-2" style={{ color: themeColors?.text }}>
                  {settings?.theme.defaultMode}
                </span>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-4">
            <h2
              className="text-2xl font-semibold"
              style={{ color: themeColors?.text }}
            >
              Current Theme Colors
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(themeColors || {}).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: value }}
                  />
                  <div>
                    <div
                      className="font-medium text-sm"
                      style={{ color: themeColors?.text }}
                    >
                      {key}
                    </div>
                    <div
                      className="text-xs opacity-70"
                      style={{ color: themeColors?.text }}
                    >
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Typography Test */}
        <div className="mt-12 space-y-4">
          <h2
            className="text-2xl font-semibold"
            style={{ color: themeColors?.text }}
          >
            Typography Test
          </h2>

          <div className="space-y-2">
            <h1 className="text-4xl" style={{ color: themeColors?.text }}>
              Heading 1 - {settings?.theme.typography.headingFont}
            </h1>
            <h2 className="text-3xl" style={{ color: themeColors?.text }}>
              Heading 2 - {settings?.theme.typography.headingFont}
            </h2>
            <h3 className="text-2xl" style={{ color: themeColors?.text }}>
              Heading 3 - {settings?.theme.typography.headingFont}
            </h3>
            <p className="text-lg" style={{ color: themeColors?.text }}>
              Body text - {settings?.theme.typography.bodyFont}
            </p>
            <p className="text-base" style={{ color: themeColors?.text }}>
              This is a sample paragraph to test the typography settings. The
              font should be applied based on the settings from Sanity.
            </p>
          </div>
        </div>

        {/* Spacing Test */}
        <div className="mt-12 space-y-4">
          <h2
            className="text-2xl font-semibold"
            style={{ color: themeColors?.text }}
          >
            Spacing Test
          </h2>

          <div className="space-y-4">
            {Object.entries(settings?.theme.spacing.spacingScale || {}).map(
              ([key, value]) => (
                <div key={key} className="flex items-center space-x-4">
                  <div
                    className="bg-red-500"
                    style={{
                      width: value,
                      height: "20px",
                      backgroundColor: themeColors?.accent,
                    }}
                  />
                  <span
                    className="font-medium"
                    style={{ color: themeColors?.text }}
                  >
                    {key}: {value}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
