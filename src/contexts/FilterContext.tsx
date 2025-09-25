import React, { createContext, useContext, useState, ReactNode, useRef } from "react";

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

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedCategoryIds: [],
  });
  const onFilterChangeRef = useRef<((filters: FilterState) => void) | null>(null);

  const updateCategoryFilter = (categoryIds: number[]) => {
    const newFilters = {
      ...filters,
      selectedCategoryIds: categoryIds,
    };
    setFilters(newFilters);
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
  };

  const updateAttributeFilter = (attributes?: string) => {
    const newFilters = {
      ...filters,
      selectedAttributes: attributes,
    };
    setFilters(newFilters);
    // Trigger immediate filtering when attributes change
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current(newFilters);
    }
  };

  const clearFilters = () => {
    const newFilters = {
      selectedCategoryIds: [],
    };
    setFilters(newFilters);
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
