import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface FilterState {
  selectedCategoryFilters: string[];
  minPrice?: number;
  maxPrice?: number;
  selectedAttributes?: string;
  inStock?: boolean;
  search?: string;
  ordering?: string;
  onSale?: boolean;
}

interface FilterContextType {
  filters: FilterState;
  updateCategoryFilter: (categoryFilters: string[]) => void;
  updatePriceFilter: (minPrice?: number, maxPrice?: number) => void;
  updateAttributeFilter: (attributes?: string) => void;
  updateOrdering: (ordering?: string) => void;
  updateOnSaleFilter: (onSale?: boolean) => void;
  clearFilters: () => void;
  setOnFilterChange: (callback: ((filters: FilterState) => void) | null) => void;
  isInitialized: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<FilterState>({
    selectedCategoryFilters: [],
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const onFilterChangeRef = useRef<((filters: FilterState) => void) | null>(null);

  // Initialize filters from URL on mount (only once)
  useEffect(() => {
    // Use direct URL parsing to avoid dependency on getFilterParams
    const urlSearchParams = new URLSearchParams(window.location.search);
    const parseCategoryFilters = (raw: string | null): string[] => {
      if (!raw) return [];
      return raw
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => (entry.includes(":") || entry.includes("|") ? entry : `category:${entry}`));
    };

    const initialFilters: FilterState = {
      selectedCategoryFilters: parseCategoryFilters(urlSearchParams.get("categories")),
      minPrice: urlSearchParams.get("minPrice")
        ? parseFloat(urlSearchParams.get("minPrice")!)
        : undefined,
      maxPrice: urlSearchParams.get("maxPrice")
        ? parseFloat(urlSearchParams.get("maxPrice")!)
        : undefined,
      selectedAttributes: urlSearchParams.get("attributes") || undefined,
      search: urlSearchParams.get("search") || undefined,
      ordering: urlSearchParams.get("ordering") || undefined,
      onSale: urlSearchParams.get("on_sale") === "true" ? true : undefined,
    };

    setFilters(initialFilters);
    setIsInitialized(true);
  }, []); // No dependencies - run only once on mount

  // Update URL when filters change (but only after initialization)
  const syncFiltersToUrl = (newFilters: FilterState) => {
    if (!isInitialized || typeof window === "undefined") return;

    const current = new URLSearchParams(window.location.search);

    // Reset to page 1 when filters change
    current.delete("page");

    // Update parameters
    if (newFilters.selectedCategoryFilters.length > 0) {
      current.set("categories", newFilters.selectedCategoryFilters.join(","));
    } else {
      current.delete("categories");
    }

    if (newFilters.minPrice) {
      current.set("minPrice", newFilters.minPrice.toString());
    } else {
      current.delete("minPrice");
    }

    if (newFilters.maxPrice) {
      current.set("maxPrice", newFilters.maxPrice.toString());
    } else {
      current.delete("maxPrice");
    }

    if (newFilters.selectedAttributes) {
      current.set("attributes", newFilters.selectedAttributes);
    } else {
      current.delete("attributes");
    }

    if (newFilters.search) {
      current.set("search", newFilters.search);
    } else {
      current.delete("search");
    }

    if (newFilters.ordering) {
      current.set("ordering", newFilters.ordering);
    } else {
      current.delete("ordering");
    }

    if (newFilters.onSale) {
      current.set("on_sale", "true");
    } else {
      current.delete("on_sale");
    }

    const newUrl = `${pathname}?${current.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  const updateCategoryFilter = (categoryFilters: string[]) => {
    const newFilters = {
      ...filters,
      selectedCategoryFilters: categoryFilters,
    };
    setFilters(newFilters);
    syncFiltersToUrl(newFilters);
    // Trigger immediate filtering when categories change
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current(newFilters);
    }
  };

  const updatePriceFilter = (minPrice?: number, maxPrice?: number) => {
    const newFilters = {
      ...filters,
      minPrice,
      maxPrice,
    };
    setFilters(newFilters);
    syncFiltersToUrl(newFilters);
    // Trigger immediate filtering when price changes
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current(newFilters);
    }
  };

  const updateAttributeFilter = (attributes?: string) => {
    const newFilters = {
      ...filters,
      selectedAttributes: attributes,
    };
    setFilters(newFilters);
    syncFiltersToUrl(newFilters);
    // Trigger immediate filtering when attributes change
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current(newFilters);
    }
  };

  const updateOrdering = (ordering?: string) => {
    const newFilters = {
      ...filters,
      ordering,
    };
    setFilters(newFilters);
    syncFiltersToUrl(newFilters);
    // Trigger immediate filtering when ordering changes
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current(newFilters);
    }
  };

  const updateOnSaleFilter = (onSale?: boolean) => {
    const newFilters = {
      ...filters,
      onSale,
    };
    setFilters(newFilters);
    syncFiltersToUrl(newFilters);
    // Trigger immediate filtering when onSale changes
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current(newFilters);
    }
  };

  const clearFilters = () => {
    const newFilters = {
      selectedCategoryFilters: [],
      minPrice: undefined,
      maxPrice: undefined,
      selectedAttributes: undefined,
      search: undefined,
      ordering: undefined,
      onSale: undefined,
    };
    setFilters(newFilters);
    syncFiltersToUrl(newFilters);
    // Trigger immediate filtering when clearing
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current(newFilters);
    }
  };

  const setOnFilterChange = (callback: ((filters: FilterState) => void) | null) => {
    onFilterChangeRef.current = callback;
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateCategoryFilter,
        updatePriceFilter,
        updateAttributeFilter,
        updateOrdering,
        updateOnSaleFilter,
        clearFilters,
        setOnFilterChange,
        isInitialized,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};
