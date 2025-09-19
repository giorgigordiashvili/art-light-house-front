import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";

interface FilterState {
  selectedCategoryIds: number[];
  minPrice?: number;
  maxPrice?: number;
  selectedAttributes?: string;
  inStock?: boolean;
  search?: string;
  ordering?: string;
}

interface FilterContextType {
  filters: FilterState;
  updateCategoryFilter: (categoryIds: number[]) => void;
  updatePriceFilter: (minPrice?: number, maxPrice?: number) => void;
  updateAttributeFilter: (attributes?: string) => void;
  clearFilters: () => void;
  setOnFilterChange: (callback: ((filters: FilterState) => void) | null) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

// Helper functions for localStorage
const FILTER_STORAGE_KEY = "artLightHouse_filters";

const saveFiltersToStorage = (filters: FilterState) => {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.warn("Failed to save filters to localStorage:", error);
  }
};

const loadFiltersFromStorage = (): FilterState => {
  try {
    const stored = localStorage.getItem(FILTER_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        selectedCategoryIds: parsed.selectedCategoryIds || [],
        minPrice: parsed.minPrice,
        maxPrice: parsed.maxPrice,
        selectedAttributes: parsed.selectedAttributes,
        inStock: parsed.inStock,
        search: parsed.search,
        ordering: parsed.ordering,
      };
    }
  } catch (error) {
    console.warn("Failed to load filters from localStorage:", error);
  }
  return { selectedCategoryIds: [] };
};

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({ selectedCategoryIds: [] });
  const [isInitialized, setIsInitialized] = useState(false);
  const onFilterChangeRef = useRef<((filters: FilterState) => void) | null>(null);

  // Initialize filters from localStorage on mount
  useEffect(() => {
    const storedFilters = loadFiltersFromStorage();
    setFilters(storedFilters);
    setIsInitialized(true);

    // If there are stored category filters, trigger filtering after initialization
    if (storedFilters.selectedCategoryIds.length > 0) {
      // Use timeout to ensure the callback is registered
      setTimeout(() => {
        if (onFilterChangeRef.current) {
          onFilterChangeRef.current(storedFilters);
        }
      }, 100);
    }
  }, []);

  const updateCategoryFilter = (categoryIds: number[]) => {
    const newFilters = {
      ...filters,
      selectedCategoryIds: categoryIds,
    };
    setFilters(newFilters);
    saveFiltersToStorage(newFilters);

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
    saveFiltersToStorage(newFilters);
  };

  const updateAttributeFilter = (attributes?: string) => {
    const newFilters = {
      ...filters,
      selectedAttributes: attributes,
    };
    setFilters(newFilters);
    saveFiltersToStorage(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      selectedCategoryIds: [],
    };
    setFilters(newFilters);
    saveFiltersToStorage(newFilters);
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
        clearFilters,
        setOnFilterChange,
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
