/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.notlukagray.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

// Auto-map private Sanity env vars to NEXT_PUBLIC_ for Studio
if (
  process.env.SANITY_PROJECT_ID &&
  !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
) {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
}
if (process.env.SANITY_DATASET && !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  process.env.NEXT_PUBLIC_SANITY_DATASET = process.env.SANITY_DATASET;
}
if (
  process.env.SANITY_API_VERSION &&
  !process.env.NEXT_PUBLIC_SANITY_API_VERSION
) {
  process.env.NEXT_PUBLIC_SANITY_API_VERSION = process.env.SANITY_API_VERSION;
}

module.exports = nextConfig;
