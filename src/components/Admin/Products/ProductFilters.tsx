"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const FiltersContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const FiltersRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #2b3445;
`;

const SearchInput = styled.input`
  padding: 0.8rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }

  &::placeholder {
    color: #7d879c;
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: #2b3445;
    color: white;
    
    &:hover {
      background: #1e2633;
    }
  `
      : `
    background: #f8f9fa;
    color: #2b3445;
    border: 1px solid #e5e5e5;
    
    &:hover {
      background: #e9ecef;
    }
  `}
`;

const LoadingState = styled.div`
  padding: 1rem;
  text-align: center;
  color: #7d879c;
  font-size: 0.9rem;
`;

interface Category {
  id: string;
  name: string;
}

interface Filters {
  search: string;
  categoryId: string;
  isActive: string;
  isFeatured: string;
}

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    // Fetch categories for the filter dropdown
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (field: keyof Filters, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: Filters = {
      search: "",
      categoryId: "",
      isActive: "",
      isFeatured: "",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some((value) => value !== "");

  return (
    <FiltersContainer>
      <FiltersRow>
        <FilterGroup>
          <Label>Search Products</Label>
          <SearchInput
            type="text"
            placeholder="Search by name, description, or SKU..."
            value={localFilters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleApplyFilters();
              }
            }}
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Category</Label>
          <Select
            value={localFilters.categoryId}
            onChange={(e) => handleInputChange("categoryId", e.target.value)}
          >
            <option value="">All Categories</option>
            {loadingCategories ? (
              <option disabled>Loading...</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Status</Label>
          <Select
            value={localFilters.isActive}
            onChange={(e) => handleInputChange("isActive", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Featured</Label>
          <Select
            value={localFilters.isFeatured}
            onChange={(e) => handleInputChange("isFeatured", e.target.value)}
          >
            <option value="">All Products</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label style={{ opacity: 0 }}>Actions</Label>
          <ButtonGroup>
            <FilterButton $variant="primary" onClick={handleApplyFilters}>
              Apply
            </FilterButton>
            {hasActiveFilters && (
              <FilterButton $variant="secondary" onClick={handleClearFilters}>
                Clear
              </FilterButton>
            )}
          </ButtonGroup>
        </FilterGroup>
      </FiltersRow>

      {loadingCategories && <LoadingState>Loading categories...</LoadingState>}
    </FiltersContainer>
  );
};

export default ProductFilters;
