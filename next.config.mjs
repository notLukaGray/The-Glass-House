import withBundleAnalyzer from "@next/bundle-analyzer";
import { createSecureHeaders } from "next-secure-headers";

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Auto-map private Sanity env vars to NEXT_PUBLIC_ for Studio
const sanityEnvVars = Object.keys(process.env)
  .filter(
    (key) => key.startsWith("SANITY_STUDIO_") || key.startsWith("SANITY_"),
  )
  .reduce((obj, key) => {
    // Convert SANITY_STUDIO_ to NEXT_PUBLIC_SANITY_STUDIO_
    // Convert SANITY_ to NEXT_PUBLIC_SANITY_
    const publicKey = `NEXT_PUBLIC_${key}`;
    obj[publicKey] = process.env[key];
    return obj;
  }, {});

// Merge with existing env vars
Object.assign(process.env, sanityEnvVars);

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  env: {
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
    SANITY_API_VERSION: process.env.SANITY_API_VERSION,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "development",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "development",
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@sanity/ui", "framer-motion", "gsap"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
              imgSrc: ["'self'", "data:", "https:"],
              connectSrc: ["'self'"],
              fontSrc: ["'self'", "https://res.cloudinary.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
              objectSrc: ["'none'"],
              mediaSrc: ["'self'"],
              frameSrc: ["'none'"],
            },
          },
          referrerPolicy: "strict-origin-when-cross-origin",
          permissionsPolicy: {
            camera: [],
            microphone: [],
            geolocation: [],
          },
          xFrameOptions: "DENY",
          xContentTypeOptions: "nosniff",
          strictTransportSecurity: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          },
        }),
      },
    ];
  },
};

export default withBundleAnalyzerConfig(nextConfig);
