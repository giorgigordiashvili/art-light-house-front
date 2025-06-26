"use client";
import React from "react";
import styled from "styled-components";

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: end;
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

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 250px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }

  &::placeholder {
    color: #7d879c;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  width: 200px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ClearButton = styled.button`
  padding: 0.8rem 1rem;
  background: #f8f9fa;
  color: #2b3445;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

interface Category {
  id: string;
  name: string;
  displayName?: string;
  parentId?: string;
}

interface Filters {
  search: string;
  parentId: string;
  isActive: string;
}

interface CategoryFiltersProps {
  filters: Filters;
  categories: Category[];
  onChange: (filters: Filters) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ filters, categories, onChange }) => {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClearFilters = () => {
    onChange({
      search: "",
      parentId: "",
      isActive: "all",
    });
  };

  // Get root categories (categories without parent) for the parent filter
  const rootCategories = categories.filter((category) => !category.parentId);

  const hasActiveFilters = filters.search || filters.parentId || filters.isActive !== "all";

  return (
    <FiltersContainer>
      <FilterGroup>
        <Label>Search Categories</Label>
        <Input
          type="text"
          placeholder="Search by name or description..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </FilterGroup>

      <FilterGroup>
        <Label>Parent Category</Label>
        <Select
          value={filters.parentId}
          onChange={(e) => handleFilterChange("parentId", e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="root">Root Categories Only</option>
          {rootCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.displayName || category.name}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label>Status</Label>
        <Select
          value={filters.isActive}
          onChange={(e) => handleFilterChange("isActive", e.target.value)}
        >
          <option value="all">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
      </FilterGroup>

      {hasActiveFilters && (
        <FilterGroup>
          <Label style={{ visibility: "hidden" }}>Clear</Label>
          <ClearButton onClick={handleClearFilters}>Clear Filters</ClearButton>
        </FilterGroup>
      )}
    </FiltersContainer>
  );
};

export default CategoryFilters;
