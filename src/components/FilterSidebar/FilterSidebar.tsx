"use client";
import React from "react";
import styled from "styled-components";
import CategoryFilter from "./CategoryFilter";
import Line from "./Line";
import AttributeFilter from "./AttributeFilter";
import PriceFilter from "./PriceFilter";
import PriceInput from "@/components/ListProductCard/PriceInput";
import PriceRangeSlider from "./PriceRangeSlider";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useFilterContext } from "@/contexts/FilterContext";

const SidebarWrapper = styled.div`
  width: 308px;
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

const StyledInputs = styled.div`
  display: flex;
  gap: 6px;
`;

const StyledButton = styled.div`
  margin-top: 20px;
`;

interface FilterSidebarProps {
  dictionary: any;
}

function FilterSidebar({ dictionary }: FilterSidebarProps) {
  // No longer need manual apply button since filtering is immediate
  const { filters, clearFilters } = useFilterContext();
  const hasActiveFilters =
    (filters.selectedCategoryIds && filters.selectedCategoryIds.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    !!filters.selectedAttributes ||
    !!filters.ordering;

  return (
    <SidebarWrapper>
      <Title>{dictionary.title}</Title>
      <Line />
      <CategoryFilter dictionary={dictionary} />
      <Line />
      <PriceFilter dictionary={dictionary} />
      <StyledInputs>
        <PriceInput text="დან" type="min" />
        <PriceInput text="მდე" type="max" />
      </StyledInputs>
      <PriceRangeSlider min={0} max={10000} />
      <Line />
      <AttributeFilter attributeName="სტილი" title={dictionary.subTitle3} />
      <Line />
      <AttributeFilter attributeName="განათების ტიპი" title={dictionary.subTitle4} />
      <StyledButton>
        <PrimaryButton
          text={dictionary.filterButton}
          width="100%"
          height="48px"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
        />
      </StyledButton>
    </SidebarWrapper>
  );
}

export default FilterSidebar;
