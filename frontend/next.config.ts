import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["localhost"], // Add specific domains if needed
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
