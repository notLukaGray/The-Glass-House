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
  experimental: {
    optimizePackageImports: ["@sanity/ui", "framer-motion", "gsap"],
  },
};

import withBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Auto-map private Sanity env vars to NEXT_PUBLIC_ for Studio
const sanityEnvVars = Object.keys(process.env)
  .filter((key) => key.startsWith("SANITY_STUDIO_"))
  .reduce((obj, key) => {
    obj[`NEXT_PUBLIC_${key}`] = process.env[key];
    return obj;
  }, {});

// Merge with existing env vars
Object.assign(process.env, sanityEnvVars);

export default withBundleAnalyzerConfig(nextConfig);
