/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dhur3fak4lnqy.cloudfront.net",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
