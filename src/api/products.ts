import axiosInstance from "./axios";
import { PaginatedProductListList } from "./generated/interfaces";

export type ProductQueryParams = Record<string, string | number | boolean | undefined>;

export const fetchClientProducts = async (
  params: ProductQueryParams
): Promise<PaginatedProductListList> => {
  const response = await axiosInstance.get("/api/ecommerce/client/products/", {
    params,
  });

  return response.data;
};

// Server-side product fetching function with revalidation
export const fetchServerProducts = async (
  params: ProductQueryParams
): Promise<PaginatedProductListList> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const queryString = new URLSearchParams(
    Object.entries(params).reduce(
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
