import type { ProductDetail, ProductImage } from "./generated/interfaces";

interface ServerProductDetailResult {
  product: ProductDetail | null;
  error: string | null;
}

// Fetch a single product detail server-side with ISR
export async function fetchServerProductDetail(
  lang: string,
  productId: number
): Promise<ServerProductDetailResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  // Map front-end language to backend Accept-Language header
  const apiLang = lang === "en" ? "en" : "ka";
  const url = `${apiUrl}/api/ecommerce/client/products/${productId}/`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }, // ISR: revalidate product detail every 60s
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": apiLang,
      },
    });

    if (!res.ok) {
      return { product: null, error: `Failed to fetch product: ${res.status} ${res.statusText}` };
    }

    const data: ProductDetail = await res.json();
    // Normalize image URLs if they are relative
    const normalizeUrl = (url?: string) => {
      if (!url) return url;
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      // Remove leading slash duplication
      const trimmed = url.startsWith("/") ? url.slice(1) : url;
      return `${apiUrl}/${trimmed}`;
    };
    let normalizedImages: ProductImage[] = Array.isArray(data.images)
      ? data.images.map((img: any, index: number) => {
          const raw = img.image || img.image_url; // support alternative key
          return { ...img, id: img.id ?? index + 1, image: normalizeUrl(raw) || raw };
        })
      : [];

    // If backend returned multiple images concatenated in data.image and images array is empty, split them.
    if (
      (!normalizedImages || normalizedImages.length === 0) &&
      typeof data.image === "string" &&
      data.image.includes(",")
    ) {
      const rawList = data.image
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const localizedName =
        typeof data.name === "string"
          ? data.name
          : (data.name as any)?.[apiLang] || (data.name as any)?.en || "Product";
      normalizedImages = rawList.map((url, index) => ({
        id: index + 1,
        image: normalizeUrl(url) || url,
        alt_text: localizedName,
        sort_order: index,
        created_at: new Date().toISOString(),
        // mark primary for first image (extra field, tolerated by consumer code)
        is_primary: index === 0,
      })) as any;
    }

    // Primary image: if we split list, use first element; else original single image or image_url
    const rawPrimary =
      Array.isArray(normalizedImages) && normalizedImages.length > 0
        ? normalizedImages[0].image
        : data.image || (data as any).image_url;
    const normalizedPrimary = normalizeUrl(rawPrimary);
    const normalized: ProductDetail = {
      ...data,
      image: normalizedPrimary,
      images: normalizedImages,
    };
    return { product: normalized, error: null };
  } catch (err: any) {
    return { product: null, error: err.message || "Failed to fetch product" };
  }
}
