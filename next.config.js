/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-daisyui"],
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
        hostname: "i.namu.wiki",
      },
      {
        protocol: "https",
        hostname: "recipe1.ezmember.co.kr",
      },
    ],
  },
};

module.exports = nextConfig;
