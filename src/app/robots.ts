import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://skinbestie.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/_next/", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
        crawlDelay: 2,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
