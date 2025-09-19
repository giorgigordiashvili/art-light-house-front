"use client";
import React from "react";
import styled from "styled-components";
import CategoryFilter from "./CategoryFilter";
import Line from "./Line";
import StyleFilter from "./StyleFilter";
import TypeFilter from "./TypeFilter";
import PriceFilter from "./PriceFilter";
import { useFilterContext } from "@/contexts/FilterContext";

const SidebarWrapper = styled.div`
  width: 308px;
  height: 1083px;
  border-radius: 17px;
  border: 1px solid #ffffff12;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-family: "Helvetica", sans-serif;
  font-weight: 700;
  font-size: 22px;
  line-height: 24px;
  letter-spacing: 0%;
  color: white;
`;

const ApplyFiltersButton = styled.button`
  width: 100%;
  height: 48px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: "Helvetica", sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f0f0f0;
  }

  &:disabled {
    background: #666666;
    color: #999999;
    cursor: not-allowed;
  }
`;

interface FilterSidebarProps {
  dictionary: any;
  onApplyFilters?: (filters: any) => void;
}

function FilterSidebar({ dictionary, onApplyFilters }: FilterSidebarProps) {
  const { filters } = useFilterContext();

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        categoryIds: filters.selectedCategoryIds,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        attributes: filters.selectedAttributes,
      });
    }
  };

  const hasFilters =
    filters.selectedCategoryIds.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.selectedAttributes !== undefined;

  return (
    <SidebarWrapper>
      <Title>{dictionary.title}</Title>
      <Line />
      <CategoryFilter dictionary={dictionary} />
      <Line />
      <PriceFilter dictionary={dictionary} />
      <Line />
      <StyleFilter dictionary={dictionary} />
      <Line />
      <TypeFilter dictionary={dictionary} />
      <ApplyFiltersButton onClick={handleApplyFilters} disabled={!hasFilters}>
        {dictionary.applyFilters || "Apply Filters"}
      </ApplyFiltersButton>
    </SidebarWrapper>
  );
}

export default FilterSidebar;
