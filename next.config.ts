import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "19010",
        pathname: "/assets/**"
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: `/api/:path*`,
        destination: `${process.env.API_URL}/:path*`,
      }
    ];
  }
};

export default nextConfig;
