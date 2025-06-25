import { cleanEnv, str, url } from "envalid";

// Environment variable validation using envalid
export const env = cleanEnv(process.env, {
  // Required for all environments
  NEXTAUTH_SECRET: str(),
  DATABASE_URL: url(),

  // Sanity CMS configuration
  SANITY_PROJECT_ID: str(),
  SANITY_DATASET: str(),
  SANITY_API_VERSION: str(),
  SANITY_TOKEN: str(),

  // Public Sanity variables (for client-side)
  NEXT_PUBLIC_SANITY_PROJECT_ID: str(),
  NEXT_PUBLIC_SANITY_DATASET: str(),
  NEXT_PUBLIC_SANITY_API_VERSION: str(),

  // Base URL for the application
  NEXT_PUBLIC_BASE_URL: url(),

  // Optional GitHub integration
  GITHUB_TOKEN: str({ default: undefined }),

  // Optional admin setup (for production deployments)
  DEFAULT_ADMIN_EMAIL: str({ default: "admin@example.com" }),
  DEFAULT_ADMIN_USERNAME: str({ default: "admin" }),
  DEFAULT_ADMIN_NAME: str({ default: "Default Admin" }),
  DEFAULT_ADMIN_PASSWORD: str({ default: undefined }),

  // Development and build tools
  NODE_ENV: str({ default: "development" }),
  ANALYZE: str({ default: undefined }),
});

// Client-side environment variables (safe to expose)
export const clientEnv = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_API_VERSION: env.NEXT_PUBLIC_SANITY_API_VERSION,
  NEXT_PUBLIC_BASE_URL: env.NEXT_PUBLIC_BASE_URL,
  NODE_ENV: env.NODE_ENV,
} as const;

// Helper functions for environment checks
export const isDevelopment = clientEnv.NODE_ENV === "development";
export const isProduction = clientEnv.NODE_ENV === "production";
export const isTest = clientEnv.NODE_ENV === "test";

// Sanity configuration helpers (server-side)
export function getSanityConfig() {
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
  return {
    url: env.DATABASE_URL,
  } as const;
}

// Authentication configuration (server-side)
export function getAuthConfig() {
  return {
    secret: env.NEXTAUTH_SECRET,
    baseUrl: env.NEXT_PUBLIC_BASE_URL,
  } as const;
}

// Admin configuration (server-side)
export function getAdminConfig() {
  return {
    email: env.DEFAULT_ADMIN_EMAIL,
    username: env.DEFAULT_ADMIN_USERNAME,
    name: env.DEFAULT_ADMIN_NAME,
    password: env.DEFAULT_ADMIN_PASSWORD,
  } as const;
}

// GitHub configuration (server-side)
export function getGitHubConfig() {
  return {
    token: env.GITHUB_TOKEN,
  } as const;
}
