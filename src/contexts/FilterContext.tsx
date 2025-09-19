import React, { createContext, useContext, useState, ReactNode } from "react";

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
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedCategoryIds: [],
  });

  const updateCategoryFilter = (categoryIds: number[]) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategoryIds: categoryIds,
    }));
  };

  const updatePriceFilter = (minPrice?: number, maxPrice?: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
    }));
  };

  const updateAttributeFilter = (attributes?: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedAttributes: attributes,
    }));
  };

  const clearFilters = () => {
    setFilters({
      selectedCategoryIds: [],
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateCategoryFilter,
        updatePriceFilter,
        updateAttributeFilter,
        clearFilters,
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
