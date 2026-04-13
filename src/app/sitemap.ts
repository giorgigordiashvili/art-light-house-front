import type { MetadataRoute } from "next";
import { i18n } from "@/config/i18n";
import { SITE_URL } from "@/lib/seo";

/** Static public-facing routes (no auth-gated pages). */
const STATIC_PATHS = [
  "", // homepage
  "/products",
  "/projects",
  "/contact",
];

async function fetchAllProductIds(): Promise<{ id: number; updatedAt?: string }[]> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://artlighthouse.api.echodesk.ge";

  const products: { id: number; updatedAt?: string }[] = [];
  let page = 1;
  let hasNext = true;

  try {
    while (hasNext) {
      const res = await fetch(
        `${apiUrl}/api/ecommerce/client/products/?page=${page}&page_size=100`,
        {
          next: { revalidate: 3600 },
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) break;
      const data = await res.json();
      const results: any[] = data.results ?? [];
      for (const p of results) {
        products.push({ id: p.id, updatedAt: p.updated_at });
      }
      hasNext = Boolean(data.next);
      page++;
    }
  } catch {
    // Gracefully return whatever we have so far
  }

  return products;
}

async function fetchAllProjectSlugs(): Promise<string[]> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://artlighthouse.api.echodesk.ge";

  try {
    const listsRes = await fetch(`${apiUrl}/api/ecommerce/client/item-lists/`, {
      next: { revalidate: 3600 },
      headers: { "Content-Type": "application/json" },
    });
    if (!listsRes.ok) return [];
    const listsData: any = await listsRes.json();
    const activeList = listsData?.results?.[0];
    if (!activeList) return [];

    const detailRes = await fetch(`${apiUrl}/api/ecommerce/client/item-lists/${activeList.id}/`, {
      next: { revalidate: 3600 },
      headers: { "Content-Type": "application/json" },
    });
    if (!detailRes.ok) return [];
    const listDetail: any = await detailRes.json();
    let rawItems: any[] = [];
    if (Array.isArray(listDetail.items)) {
      rawItems = listDetail.items;
    } else {
      try {
        rawItems = JSON.parse(listDetail.items || "[]");
      } catch {
        rawItems = [];
      }
    }

    return rawItems
      .map((item: any) => {
        const cd =
          typeof item.custom_data === "string"
            ? (() => {
                try {
                  return JSON.parse(item.custom_data);
                } catch {
                  return {};
                }
              })()
            : (item.custom_data ?? {});
        return cd.slug || item.custom_id || (item.id != null ? String(item.id) : null);
      })
      .filter(Boolean) as string[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of i18n.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic product pages
  const products = await fetchAllProductIds();
  for (const product of products) {
    for (const locale of i18n.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/products/${product.id}`,
        lastModified: product.updatedAt || now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Dynamic project pages
  const projectSlugs = await fetchAllProjectSlugs();
  for (const slug of projectSlugs) {
    for (const locale of i18n.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/projects/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
