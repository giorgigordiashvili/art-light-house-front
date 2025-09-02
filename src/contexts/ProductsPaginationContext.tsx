"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { usePaginatedProducts } from "@/hooks/usePaginatedProducts";

interface ProductsPaginationProviderProps {
  children: ReactNode;
  perPage?: number;
}

const ProductsPaginationContext = createContext<ReturnType<typeof usePaginatedProducts> | null>(
  null
);

export const ProductsPaginationProvider = ({
  children,
  perPage,
}: ProductsPaginationProviderProps) => {
  const value = usePaginatedProducts({ perPage });
  return (
    <ProductsPaginationContext.Provider value={value}>
      {children}
    </ProductsPaginationContext.Provider>
  );
};

export const useProductsPagination = () => {
  const ctx = useContext(ProductsPaginationContext);
  if (!ctx) throw new Error("useProductsPagination must be used within ProductsPaginationProvider");
  return ctx;
};

export default ProductsPaginationContext;
