/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dhur3fak4lnqy.cloudfront.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "dpmg08zn22q82.cloudfront.net",
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
