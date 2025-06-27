"use client";

import React from "react";
import styled from "styled-components";
import { CustomerFiltersState } from "./CustomerManagement";

const FiltersContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #495057;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;
  background: white;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-end;

  ${(props) =>
    props.variant === "primary" &&
    `
    background: #007bff;
    border-color: #007bff;
    color: white;
    &:hover { background: #0056b3; border-color: #0056b3; }
  `}

  ${(props) =>
    props.variant === "secondary" &&
    `
    background: white;
    border-color: #6c757d;
    color: #6c757d;
    &:hover { background: #f8f9fa; }
  `}
`;

interface CustomerFiltersProps {
  filters: CustomerFiltersState;
  onFiltersChange: (filters: Partial<CustomerFiltersState>) => void;
  onRefresh: () => void;
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
}) => {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ search });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    onFiltersChange({ sortBy, sortOrder });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      sortBy: "created_at",
      sortOrder: "desc",
    });
  };

  return (
    <FiltersContainer>
      <FiltersRow>
        <FilterGroup>
          <FilterLabel>Search Customers</FilterLabel>
          <FilterInput
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Sort By</FilterLabel>
          <FilterSelect
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value, filters.sortOrder)}
          >
            <option value="created_at">Date Joined</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="updated_at">Last Updated</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Sort Order</FilterLabel>
          <FilterSelect
            value={filters.sortOrder}
            onChange={(e) => handleSortChange(filters.sortBy, e.target.value as "asc" | "desc")}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>&nbsp;</FilterLabel>
          <div style={{ display: "flex", gap: "8px" }}>
            <ActionButton variant="secondary" onClick={handleClearFilters}>
              Clear Filters
            </ActionButton>
            <ActionButton variant="primary" onClick={onRefresh}>
              Refresh
            </ActionButton>
          </div>
        </FilterGroup>
      </FiltersRow>
    </FiltersContainer>
  );
};

export default CustomerFilters;
