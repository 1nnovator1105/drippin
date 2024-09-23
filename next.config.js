/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-daisyui"],
  experimental: {
    scrollRestoration: true,
    //Only For Next.js versions prior to 14.1.0 because it is enabled by default since version 14.1.0
    windowHistorySupport: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "t1.daumcdn.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "recipe1.ezmember.co.kr",
      },
      {
        protocol: "https",
        hostname: "cdn.sisajournal.com",
      },
      {
        protocol: "https",
        hostname: "rpahjyrtfkrbplntumfr.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
