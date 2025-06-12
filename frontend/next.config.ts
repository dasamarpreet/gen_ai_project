import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true, // Use true if you want a 308 Permanent Redirect
      },
    ];
  },
};

export default nextConfig;
