import withBundleAnalyzer from "@next/bundle-analyzer";
import { createSecureHeaders } from "next-secure-headers";

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.notlukagray.com",
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
              scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://core.sanity-cdn.com",
                "https://va.vercel-scripts.com",
              ],
              scriptSrcElem: [
                "'self'",
                "'unsafe-inline'",
                "https://core.sanity-cdn.com",
                "https://va.vercel-scripts.com",
              ],
              imgSrc: [
                "'self'",
                "data:",
                "https:",
                "https://images.unsplash.com",
                "https://www.w3schools.com",
                "https://res.cloudinary.com",
                "https://media.notlukagray.com",
              ],
              connectSrc: [
                "'self'",
                "data:",
                "https://*.sanity.io",
                "https://va.vercel-scripts.com",
                "https://api.github.com",
                "https://ep-calm-meadow-a8e25r6a.eastus2.azure.neon.tech",
                "https://media.notlukagray.com",
                "https://notlukagray.com",
                "https://iframe.mediadelivery.net",
                "https://*.b-cdn.net",
                "https://*.mediadelivery.net",
              ],
              fontSrc: [
                "'self'",
                "https://res.cloudinary.com",
                "https://fonts.googleapis.com",
                "https://fonts.gstatic.com",
              ],
              objectSrc: ["'none'"],
              mediaSrc: [
                "'self'",
                "https://media.notlukagray.com",
                "https://video.bunnycdn.com",
                "https://iframe.mediadelivery.net",
                "https://vz-150995e9-3b5.b-cdn.net",
              ],
              frameSrc: ["'self'", "https://iframe.mediadelivery.net"],
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
