import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Old list pages, replaced by the county explore flow.
  async redirects() {
    return [
      { source: "/sites", destination: "/", permanent: false },
      { source: "/proposals", destination: "/", permanent: false },
      { source: "/counties", destination: "/", permanent: false },
      { source: "/counties/:fips", destination: "/explore/:fips/community", permanent: false },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
