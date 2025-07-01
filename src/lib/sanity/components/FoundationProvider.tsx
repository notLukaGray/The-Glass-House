"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import { LanguageConfig } from "../utils/foundationUtils";

interface FoundationContextType {
  localization: {
    additionalLanguages: LanguageConfig[];
    defaultLanguage: string;
    fallbackLanguage: string;
  } | null;
  behavior: {
    scrollBehaviors: Array<{
      name: string;
      title: string;
      enabled: boolean;
    }>;
  } | null;
  loading: boolean;
  error: string | null;
}

const FoundationContext = createContext<FoundationContextType>({
  localization: null,
  behavior: null,
  loading: true,
  error: null,
});

export const useFoundation = () => {
  const context = useContext(FoundationContext);
  if (!context) {
    throw new Error("useFoundation must be used within FoundationProvider");
  }
  return context;
};

interface FoundationProviderProps {
  children: React.ReactNode;
}

export const FoundationProvider: React.FC<FoundationProviderProps> = ({
  children,
}) => {
  const [foundation, setFoundation] = useState<FoundationContextType>({
    localization: null,
    behavior: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFoundation = async () => {
      try {
        const client = createClient({
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
          apiVersion: "2024-01-01",
          useCdn: false,
        });

        // Fetch both foundation documents in parallel
        const [localizationData, behaviorData] = await Promise.all([
          client.fetch(`
            *[_type == "foundationLocalization"][0] {
              additionalLanguages,
              defaultLanguage,
              fallbackLanguage
            }
          `),
          client.fetch(`
            *[_type == "foundationBehavior"][0] {
              scrollBehaviors[] {
                name,
                title,
                enabled
              }
            }
          `),
        ]);

        // Properly type the localization data
        const localization = localizationData
          ? {
              additionalLanguages: (
                (localizationData.additionalLanguages || []) as LanguageConfig[]
              ).map((lang) => ({
                code: lang.code,
                name: lang.name,
                enabled: lang.enabled,
                direction: (lang.direction === "rtl" ? "rtl" : "ltr") as
                  | "ltr"
                  | "rtl",
              })),
              defaultLanguage: (localizationData.defaultLanguage ||
                "en") as string,
              fallbackLanguage: (localizationData.fallbackLanguage ||
                "en") as string,
            }
          : null;

        setFoundation({
          localization,
          behavior: behaviorData,
          loading: false,
          error: null,
        });
      } catch {
        setFoundation({
          localization: null,
          behavior: null,
          loading: false,
          error: "Failed to load foundation settings",
        });
      } finally {
        // ... existing code ...
      }
    };

    fetchFoundation();
  }, []);

  return (
    <FoundationContext.Provider value={foundation}>
      {children}
    </FoundationContext.Provider>
  );
};
