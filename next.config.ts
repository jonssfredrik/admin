import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/subscriptions/calendar",
        destination: "/calendar",
        permanent: false,
      },
    ];
  },
};

export default config;
