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

module.exports = async () => {
  const withSerwistInit = (await import("@serwist/next")).default;

  const withSerwist = withSerwistInit({
    // The source file for your service worker
    swSrc: "src/app/sw.ts",
    // Where to output the generated service worker (same path as your old sw.js)
    swDest: "public/sw.js",
    // Disable service worker in development to avoid caching issues
    disable: process.env.NODE_ENV === "development",
    // Don't reload when coming online (avoid interrupting users)
    reloadOnOnline: false,
    // Additional configuration for better control
    cacheOnNavigation: true,
    // Register the service worker
    register: true,
    // Scope of the service worker
    scope: "/",
  });

  return withSerwist(nextConfig);
};
