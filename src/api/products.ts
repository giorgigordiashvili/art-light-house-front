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
