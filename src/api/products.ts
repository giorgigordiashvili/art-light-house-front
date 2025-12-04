import axiosInstance from "./axios";
import {
  PaginatedProductListList,
  PaginatedAttributeDefinitionList,
  AttributeDefinition,
} from "./generated/interfaces";

export type ProductQueryParams = Record<string, string | number | boolean | undefined>;

export const fetchClientProducts = async (
  params: ProductQueryParams
): Promise<PaginatedProductListList> => {
  const response = await axiosInstance.get("/api/ecommerce/client/products/", {
    params: {
      ...params,
      page_size: 12, // Always fetch 12 items per page
    },
  });

  return response.data;
};

// Server-side product fetching function with revalidation
export const fetchServerProducts = async (
  params: ProductQueryParams
): Promise<PaginatedProductListList> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://artlighthouse.api.echodesk.ge";
  const queryString = new URLSearchParams(
    Object.entries({ ...params, page_size: 12 }).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      },
      {} as Record<string, string>
    )
  ).toString();

  const url = `${apiUrl}/api/ecommerce/client/products/${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
};

// Server-side attributes fetching function with revalidation
export const fetchServerAttributes = async (): Promise<AttributeDefinition[]> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://artlighthouse.api.echodesk.ge";
  const results: AttributeDefinition[] = [];
  let page = 1;
  let hasNext = false;

  do {
    const url = `${apiUrl}/api/ecommerce/client/attributes/?ordering=sort_order&page=${page}`;

    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch attributes: ${response.statusText}`);
    }

    const data: PaginatedAttributeDefinitionList = await response.json();
    results.push(...(data.results ?? []));
    hasNext = Boolean(data.next);
    page += 1;
  } while (hasNext);

  return results;
};

// Server-side featured products fetching function with revalidation
export const fetchServerFeaturedProducts = async (): Promise<PaginatedProductListList> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://artlighthouse.api.echodesk.ge";
  const url = `${apiUrl}/api/ecommerce/client/products/?is_featured=true&language=ka&max_price=500&min_price=0&on_sale=true&ordering=price&page=1&page_size=12`;

  const response = await fetch(url, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch featured products: ${response.statusText}`);
  }

  return response.json();
};
