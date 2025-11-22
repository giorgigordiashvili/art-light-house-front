interface RawListItem {
  id?: number | string;
  custom_id?: string;
  custom_data?: any;
  label?: string;
  is_active?: boolean;
}

export interface ServerProjectDetail {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  client?: string;
  category?: string;
  year?: string;
  location?: string;
  is_featured?: boolean;
  primary_image_url?: string;
  images: { id: string; image_url: string; alt_text?: string }[];
}

function parseJSON(value: any, fallback: any) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  if (typeof value === "object") return value;
  return fallback;
}

function galleryArray(gallery: any): any[] {
  if (!gallery) return [];
  if (Array.isArray(gallery)) return gallery;
  if (typeof gallery === "string") {
    try {
      const parsed = JSON.parse(gallery);
      return Array.isArray(parsed) ? parsed : [gallery];
    } catch {
      return [gallery];
    }
  }
  return [gallery];
}

function buildImages(gallery: any, fallbackTitle: string) {
  return galleryArray(gallery)
    .map((entry: any, idx: number) => {
      if (!entry) return null;
      if (typeof entry === "string") {
        return { id: `g-${idx}`, image_url: entry, alt_text: fallbackTitle };
      }
      if (typeof entry === "object") {
        const imageUrl =
          entry.image_url ||
          entry.image ||
          entry.url ||
          entry.src ||
          (typeof entry.file === "string" ? entry.file : undefined);
        if (!imageUrl) return null;
        return {
          id: String(entry.id ?? `g-${idx}`),
          image_url: imageUrl,
          alt_text: entry.alt_text || entry.title || fallbackTitle,
        };
      }
      return null;
    })
    .filter(Boolean) as { id: string; image_url: string; alt_text?: string }[];
}

function slugCandidates(item: RawListItem) {
  const cd = parseJSON(item.custom_data, {});
  return [cd.slug, item.custom_id, item.id != null ? String(item.id) : null]
    .filter(Boolean)
    .map((v) => String(v).trim().toLowerCase());
}

function buildDetail(item: any): ServerProjectDetail {
  const cd = parseJSON(item.custom_data, {});
  const galleryImages = buildImages(cd.gallery || cd.images, cd.title || item.label || "Project");
  const primaryImage = cd.image || cd.primary_image;
  const images = galleryImages.length
    ? galleryImages
    : primaryImage
      ? [{ id: "primary", image_url: primaryImage, alt_text: cd.title || item.label || "Project" }]
      : [];
  const numericId = typeof item.id === "number" ? item.id : Number(item.id ?? 0);
  return {
    id: Number.isNaN(numericId) ? 0 : numericId,
    title: cd.title || item.label || `Project ${item.id}`,
    short_description: cd.short_description,
    description: cd.description,
    client: cd.client,
    category: cd.category || cd.type,
    year: cd.year,
    location: cd.location,
    is_featured: Boolean(cd.is_featured ?? item.is_active),
    primary_image_url: images[0]?.image_url,
    images,
  };
}

export async function fetchServerProjectDetail(lang: string, slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const acceptLanguage = lang === "en" ? "en" : "ka";
  const normalizedSlug = (() => {
    try {
      return decodeURIComponent(slug).trim().toLowerCase();
    } catch {
      return slug.trim().toLowerCase();
    }
  })();

  try {
    const listsRes = await fetch(`${apiUrl}/api/ecommerce/client/item-lists/`, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json", "Accept-Language": acceptLanguage },
    });
    if (!listsRes.ok) throw new Error(`Lists fetch failed: ${listsRes.status}`);
    const listsData: any = await listsRes.json();
    const activeList = listsData?.results?.[0];
    if (!activeList) return { project: null, error: null };

    const detailRes = await fetch(`${apiUrl}/api/ecommerce/client/item-lists/${activeList.id}/`, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json", "Accept-Language": acceptLanguage },
    });
    if (!detailRes.ok) throw new Error(`List detail failed: ${detailRes.status}`);
    const listDetail: any = await detailRes.json();
    const rawItemsAny = listDetail.items;
    let rawItems: RawListItem[] = [];
    if (Array.isArray(rawItemsAny)) rawItems = rawItemsAny as RawListItem[];
    else {
      try {
        const serialized =
          typeof rawItemsAny === "string" ? rawItemsAny : JSON.stringify(rawItemsAny ?? []);
        const parsed = JSON.parse(serialized || "[]");
        rawItems = Array.isArray(parsed) ? (parsed as RawListItem[]) : [];
      } catch {
        rawItems = [];
      }
    }

    const target = rawItems.find((item) => slugCandidates(item).includes(normalizedSlug));
    if (!target || !target.id) return { project: null, error: "Project not found" };

    const itemRes = await fetch(
      `${apiUrl}/api/ecommerce/client/item-lists/${activeList.id}/items/${target.id}/`,
      {
        next: { revalidate: 60 },
        headers: { "Content-Type": "application/json", "Accept-Language": acceptLanguage },
      }
    );
    if (!itemRes.ok) throw new Error(`Item detail failed: ${itemRes.status}`);
    const detailedItem: any = await itemRes.json();
    return { project: buildDetail(detailedItem), error: null };
  } catch (err: any) {
    return { project: null, error: err?.message || "Failed to load project" };
  }
}
