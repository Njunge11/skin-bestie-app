// utils/wp.ts
const WP_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`;

type WPInit = {
  /** ISR seconds; set to 0 if you want to opt out and still keep this helper */
  revalidate?: number;
  /** Optional Next.js route tags for cache invalidation */
  tags?: string[];
  /** Extra headers if you need them */
  headers?: Record<string, string>;
};

type WPResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function wpFetch<T = any>(
  query: string,
  variables?: Record<string, any>,
  init: WPInit = {}
): Promise<T> {
  const { revalidate = 60, tags = ["wordpress"], headers = {} } = init;

  const res = await fetch(WP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
    // ✅ ISR-friendly caching (no cookies, no draftMode)
    cache: "force-cache",
    next: { revalidate, tags },
  });

  if (!res.ok) {
    const text = await safeText(res);
    throw new Error(`GraphQL HTTP ${res.status}: ${text ?? res.statusText}`);
  }

  const json = (await res.json()) as WPResponse<T>;

  if (json.errors?.length) {
    const msg = json.errors.map((e) => e.message).join(" | ");
    throw new Error(`GraphQL errors: ${msg}`);
  }

  return json.data as T;
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return null;
  }
}
