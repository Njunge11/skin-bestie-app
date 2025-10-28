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
  serverExternalPackages: [
    '@react-email/components',
    '@react-email/render',
  ],
};

module.exports = nextConfig;
