import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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

// Helper to parse filters from URL params
const parseFiltersFromUrl = (urlSearchParams: URLSearchParams): FilterState => {
  const parseCategoryFilters = (raw: string | null): string[] => {
    if (!raw) return [];
    return raw
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => (entry.includes(":") || entry.includes("|") ? entry : `category:${entry}`));
  };

  return {
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
};

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [filters, setFilters] = useState<FilterState>({
    selectedCategoryFilters: [],
  });
  // Always holds the latest filters so updaters called from stale closures
  // (e.g. debounced inputs) never revert newer changes
  const filtersRef = useRef<FilterState>(filters);
  const [isInitialized, setIsInitialized] = useState(false);
  const onFilterChangeRef = useRef<((filters: FilterState) => void) | null>(null);
  // Track if we're in the middle of an internal update to avoid loops
  const isInternalUpdate = useRef(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const initialFilters = parseFiltersFromUrl(urlSearchParams);
    filtersRef.current = initialFilters;
    setFilters(initialFilters);
    setIsInitialized(true);
  }, []);

  // Listen for URL changes (e.g., from external navigation like menu links)
  // and sync filter state when URL params change
  useEffect(() => {
    if (!isInitialized) return;

    // Skip if this is an internal update (we triggered the URL change)
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const urlSearchParams = new URLSearchParams(searchParamsString);
    const newFilters = parseFiltersFromUrl(urlSearchParams);

    // Check if filters actually changed to avoid unnecessary updates
    const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(filters);

    if (filtersChanged) {
      // Only sync state here. The new server data arrives together with the new
      // URL, so triggering the loading callback would leave skeletons stuck.
      filtersRef.current = newFilters;
      setFilters(newFilters);
    }
  }, [searchParamsString, isInitialized, filters]); // Re-run when query string changes

  // Update URL when filters change (but only after initialization).
  // Returns true when a navigation was triggered.
  const syncFiltersToUrl = (newFilters: FilterState): boolean => {
    if (!isInitialized || typeof window === "undefined") return false;

    const current = new URLSearchParams(window.location.search);

    // Reset to page 1 when filters change
    current.delete("page");

    // Update parameters
    if (newFilters.selectedCategoryFilters.length > 0) {
      current.set("categories", newFilters.selectedCategoryFilters.join(","));
    } else {
      current.delete("categories");
    }

    if (newFilters.minPrice !== undefined && !Number.isNaN(newFilters.minPrice)) {
      current.set("minPrice", newFilters.minPrice.toString());
    } else {
      current.delete("minPrice");
    }

    if (newFilters.maxPrice !== undefined && !Number.isNaN(newFilters.maxPrice)) {
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

    const queryString = current.toString();
    const currentSearch = window.location.search.replace(/^\?/, "");
    // Nothing changed in the URL: skip the navigation (and the server round-trip)
    if (queryString === currentSearch) return false;

    // Mark as internal update to prevent the URL-change effect from re-triggering
    isInternalUpdate.current = true;

    const newUrl = `${pathname}?${queryString}`;
    router.replace(newUrl, { scroll: false });
    return true;
  };

  // Apply new filters: update state, sync URL and trigger the loading callback
  const commitFilters = (newFilters: FilterState) => {
    filtersRef.current = newFilters;
    setFilters(newFilters);
    const navigated = syncFiltersToUrl(newFilters);
    // Trigger immediate filtering only when a navigation will bring new data,
    // otherwise the loading state would never be reset
    if (navigated && onFilterChangeRef.current) {
      onFilterChangeRef.current(newFilters);
    }
  };

  const updateCategoryFilter = (categoryFilters: string[]) => {
    commitFilters({
      ...filtersRef.current,
      selectedCategoryFilters: categoryFilters,
    });
  };

  const updatePriceFilter = (minPrice?: number, maxPrice?: number) => {
    commitFilters({
      ...filtersRef.current,
      minPrice,
      maxPrice,
    });
  };

  const updateAttributeFilter = (attributes?: string) => {
    commitFilters({
      ...filtersRef.current,
      selectedAttributes: attributes,
    });
  };

  const updateOrdering = (ordering?: string) => {
    commitFilters({
      ...filtersRef.current,
      ordering,
    });
  };

  const updateOnSaleFilter = (onSale?: boolean) => {
    commitFilters({
      ...filtersRef.current,
      onSale,
    });
  };

  const clearFilters = () => {
    const newFilters: FilterState = {
      selectedCategoryFilters: [],
      minPrice: undefined,
      maxPrice: undefined,
      selectedAttributes: undefined,
      search: undefined,
      ordering: undefined,
      onSale: undefined,
    };

    filtersRef.current = newFilters;
    setFilters(newFilters);

    // Navigate once to the base products path (no query string),
    // e.g. /ge/products or /en/products. Skip if already there.
    if (typeof window !== "undefined" && window.location.search !== "") {
      if (isInitialized) isInternalUpdate.current = true;
      router.replace(pathname, { scroll: false });

      // Trigger immediate filtering when clearing
      if (onFilterChangeRef.current) {
        onFilterChangeRef.current(newFilters);
      }
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
