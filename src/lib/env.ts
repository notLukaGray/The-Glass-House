// Environment variable validation schema
interface EnvSchema {
  // Required for all environments
  NEXTAUTH_SECRET: string;
  DATABASE_URL: string;

  // Sanity CMS configuration
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_VERSION: string;
  SANITY_TOKEN: string;

  // Public Sanity variables (for client-side)
  NEXT_PUBLIC_SANITY_PROJECT_ID: string;
  NEXT_PUBLIC_SANITY_DATASET: string;
  NEXT_PUBLIC_SANITY_API_VERSION: string;

  // Base URL for the application
  NEXT_PUBLIC_BASE_URL: string;

  // Optional GitHub integration
  GITHUB_TOKEN?: string;

  // Optional admin setup (for production deployments)
  DEFAULT_ADMIN_EMAIL?: string;
  DEFAULT_ADMIN_USERNAME?: string;
  DEFAULT_ADMIN_NAME?: string;
  DEFAULT_ADMIN_PASSWORD?: string;

  // Development and build tools
  NODE_ENV: "development" | "production" | "test";
  ANALYZE?: string;
}

// Client-side environment variables (safe to expose)
export const clientEnv = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
} as const;

// Server-side environment validation
function validateServerEnv(): EnvSchema {
  const env = process.env as unknown as EnvSchema;

  // Required variables that must be present
  const requiredVars = [
    "NEXTAUTH_SECRET",
    "DATABASE_URL",
    "SANITY_PROJECT_ID",
    "SANITY_DATASET",
    "SANITY_API_VERSION",
    "SANITY_TOKEN",
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    "NEXT_PUBLIC_SANITY_DATASET",
    "NEXT_PUBLIC_SANITY_API_VERSION",
    "NEXT_PUBLIC_BASE_URL",
  ];

  const missingVars = requiredVars.filter(
    (varName) => !env[varName as keyof EnvSchema],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please check your .env.local file and ensure all required variables are set.",
    );
  }

  // Validate NODE_ENV
  if (!["development", "production", "test"].includes(env.NODE_ENV || "")) {
    throw new Error(
      `Invalid NODE_ENV: ${env.NODE_ENV}. Must be one of: development, production, test`,
    );
  }

  // Validate URL formats
  try {
    new URL(env.NEXT_PUBLIC_BASE_URL);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_BASE_URL: ${env.NEXT_PUBLIC_BASE_URL}. Must be a valid URL.`,
    );
  }

  try {
    new URL(env.DATABASE_URL);
  } catch {
    throw new Error(
      `Invalid DATABASE_URL: ${env.DATABASE_URL}. Must be a valid database URL.`,
    );
  }

  // Validate Sanity configuration
  if (!env.SANITY_PROJECT_ID.match(/^[a-z0-9-]+$/)) {
    throw new Error(
      `Invalid SANITY_PROJECT_ID: ${env.SANITY_PROJECT_ID}. Must contain only lowercase letters, numbers, and hyphens.`,
    );
  }

  if (!env.SANITY_DATASET.match(/^[a-z0-9-]+$/)) {
    throw new Error(
      `Invalid SANITY_DATASET: ${env.SANITY_DATASET}. Must contain only lowercase letters, numbers, and hyphens.`,
    );
  }

  // Validate NEXTAUTH_SECRET strength
  if (env.NEXTAUTH_SECRET.length < 32) {
    throw new Error(
      `NEXTAUTH_SECRET is too short (${env.NEXTAUTH_SECRET.length} characters). ` +
        "Must be at least 32 characters long for security.",
    );
  }

  // Validate admin password if provided
  if (env.DEFAULT_ADMIN_PASSWORD) {
    if (env.DEFAULT_ADMIN_PASSWORD.length < 8) {
      throw new Error(
        "DEFAULT_ADMIN_PASSWORD must be at least 8 characters long.",
      );
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(env.DEFAULT_ADMIN_PASSWORD)) {
      throw new Error(
        "DEFAULT_ADMIN_PASSWORD must contain at least one letter and one number.",
      );
    }
  }

  return env;
}

// Server-side environment getter
export function getServerEnv(): EnvSchema {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() should only be called on the server side");
  }

  return validateServerEnv();
}

// Helper functions for environment checks
export const isDevelopment = clientEnv.NODE_ENV === "development";
export const isProduction = clientEnv.NODE_ENV === "production";
export const isTest = clientEnv.NODE_ENV === "test";

// Sanity configuration helpers (server-side)
export function getSanityConfig() {
  const env = getServerEnv();
  return {
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    apiVersion: env.SANITY_API_VERSION,
    token: env.SANITY_TOKEN,
    publicProjectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    publicDataset: env.NEXT_PUBLIC_SANITY_DATASET,
    publicApiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  } as const;
}

// Database configuration (server-side)
export function getDatabaseConfig() {
  const env = getServerEnv();
  return {
    url: env.DATABASE_URL,
  } as const;
}

// Authentication configuration (server-side)
export function getAuthConfig() {
  const env = getServerEnv();
  return {
    secret: env.NEXTAUTH_SECRET,
    baseUrl: env.NEXT_PUBLIC_BASE_URL,
  } as const;
}

// Admin configuration (server-side)
export function getAdminConfig() {
  const env = getServerEnv();
  return {
    email: env.DEFAULT_ADMIN_EMAIL || "admin@example.com",
    username: env.DEFAULT_ADMIN_USERNAME || "admin",
    name: env.DEFAULT_ADMIN_NAME || "Default Admin",
    password: env.DEFAULT_ADMIN_PASSWORD,
  } as const;
}

// GitHub configuration (server-side)
export function getGitHubConfig() {
  const env = getServerEnv();
  return {
    token: env.GITHUB_TOKEN,
  } as const;
}
