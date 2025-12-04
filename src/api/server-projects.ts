export interface ServerProjectItem {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  year?: string;
  location?: string;
  slug?: string;
  isFeatured?: boolean;
}

export interface ServerProjectsResult {
  projects: ServerProjectItem[];
  categories: string[];
  error?: string | null;
}

function getFirstGalleryImage(gallery: any): string | undefined {
  if (!gallery) return undefined;
  if (typeof gallery === "string") return gallery;
  if (Array.isArray(gallery) && gallery.length > 0) {
    const first = gallery[0];
    if (typeof first === "string") return first;
    if (typeof first?.url === "string") return first.url;
    if (typeof first?.image === "string") return first.image;
  }
  return undefined;
}

export async function fetchServerProjects(lang: string): Promise<ServerProjectsResult> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://artlighthouse.api.echodesk.ge";
  const acceptLanguage = lang === "en" ? "en" : "ka"; // map ge -> ka

  try {
    // Fetch item lists (choose first active list as before)
    const listsRes = await fetch(`${apiUrl}/api/ecommerce/client/item-lists/`, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
    });

    if (!listsRes.ok) {
      throw new Error(`Failed to fetch lists: ${listsRes.status}`);
    }

    const listsData: any = await listsRes.json();
    const activeList = listsData?.results?.[0];
    if (!activeList) {
      return { projects: [], categories: [], error: null };
    }

    const detailRes = await fetch(`${apiUrl}/api/ecommerce/client/item-lists/${activeList.id}/`, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
    });
    if (!detailRes.ok) {
      throw new Error(`Failed to fetch list detail: ${detailRes.status}`);
    }
    const listDetail: any = await detailRes.json();
    const rawItemsData = listDetail.items as unknown;

    const rawItems = Array.isArray(rawItemsData)
      ? rawItemsData
      : (() => {
          try {
            const serialized =
              typeof rawItemsData === "string" ? rawItemsData : JSON.stringify(rawItemsData ?? []);
            const parsed = JSON.parse(serialized || "[]");
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })();

    const projects: ServerProjectItem[] = rawItems
      .filter((item: any) => item && item.is_active !== false)
      .map((item: any) => {
        const customData = item.custom_data || {};
        return {
          id: item.id,
          title: customData.title || item.label || `Project ${item.id}`,
          description: customData.description,
          imageUrl: getFirstGalleryImage(customData.gallery),
          category: customData.category || customData.type,
          year: customData.year,
          location: customData.location,
          slug: customData.slug || item.custom_id || String(item.id),
          isFeatured: Boolean(customData.is_featured),
        };
      });

    const categories = Array.from(
      new Set(projects.map((p) => p.category).filter((c): c is string => Boolean(c)))
    );

    return { projects, categories, error: null };
  } catch (err: any) {
    return { projects: [], categories: [], error: err?.message || "Failed to load projects" };
  }
}
