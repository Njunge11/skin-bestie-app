import { MetadataRoute } from "next";

export const revalidate = 3600; // Revalidate every hour

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://skinbestie.com";

async function getTotalCounts() {
  try {
    const response = await fetch(
      `${process.env.WORDPRESS_API_URL}/wp-json/sitemap/v1/totalpages`,
      { next: { revalidate: 3600 } },
    );
    const data = await response.json();
    if (!data) return [];
    const propertyNames = Object.keys(data);

    const excludeItems = ["page", "user", "category", "tag"];
    const totalArray = propertyNames
      .filter((name) => !excludeItems.includes(name))
      .map((name) => {
        return { name, total: data[name] };
      });

    return totalArray;
  } catch (error) {
    console.error("Error fetching WordPress sitemap counts:", error);
    return [];
  }
}

async function getPostsUrls({
  page,
  type,
  perPage,
}: {
  page: number;
  type: string;
  perPage: number;
}) {
  try {
    const response = await fetch(
      `${process.env.WORDPRESS_API_URL}/wp-json/sitemap/v1/posts?pageNo=${page}&postType=${type}&perPage=${perPage}`,
      { next: { revalidate: 3600 } },
    );

    const data = await response.json();

    if (!data) return [];

    const posts = data.map(
      (post: { url: string; post_modified_date: string }) => {
        return {
          url: `${baseUrl}${post.url}`,
          lastModified: new Date(post.post_modified_date),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      },
    );

    return posts;
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Static app routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/onboarding`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Fetch WordPress content
  const details = await getTotalCounts();

  const postsUrls = await Promise.all(
    details.map(async (detail) => {
      const { name, total } = detail;
      const perPage = 50;
      const totalPages = Math.ceil(total / perPage);

      const urls = await Promise.all(
        Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
          getPostsUrls({ page, type: name, perPage }),
        ),
      );

      return urls.flat();
    }),
  );

  const wordpressPosts = postsUrls.flat();

  return [...staticRoutes, ...wordpressPosts];
}
