"use client";
import React, { useMemo } from "react";
import styled from "styled-components";
import Line from "./Line";
import PriceFilter from "./PriceFilter";
import PriceInput from "@/components/ListProductCard/PriceInput";
import PriceRangeSlider from "./PriceRangeSlider";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useFilterContext } from "@/contexts/FilterContext";
import CheckboxGroup from "./CheckboxGroup";
import { useFilterAttributeGroups, FilterGroup } from "@/hooks/useFilterAttributeGroups";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/utils/getLocaleFromPath";
import FiltersLoadingSkeleton from "./FiltersLoadingSkeleton";

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

const SectionMessage = styled.p`
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 20px;
`;

interface FilterSidebarProps {
  dictionary: any;
}

function FilterSidebar({ dictionary }: FilterSidebarProps) {
  // No longer need manual apply button since filtering is immediate
  const pathname = usePathname();
  const language = getLocaleFromPath(pathname);
  const { filters, clearFilters, updateCategoryFilter, updateAttributeFilter } = useFilterContext();
  const {
    groups,
    loading: filtersLoading,
    error: filtersError,
  } = useFilterAttributeGroups(language);
  const categoryGroups = useMemo(() => groups.filter((group) => group.isCategoryGroup), [groups]);
  const attributeGroups = useMemo(() => groups.filter((group) => !group.isCategoryGroup), [groups]);
  const selectedAttributeSet = useMemo(() => {
    if (!filters.selectedAttributes) return new Set<string>();
    return new Set(filters.selectedAttributes.split(",").filter(Boolean));
  }, [filters.selectedAttributes]);
  const hasActiveFilters =
    (filters.selectedCategoryIds && filters.selectedCategoryIds.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    !!filters.selectedAttributes ||
    !!filters.ordering;

  const handleCategoryChange = (value: string) => {
    const categoryId = Number(value);
    if (!Number.isFinite(categoryId)) return;

    const isSelected = filters.selectedCategoryIds.includes(categoryId);
    const updatedIds = isSelected
      ? filters.selectedCategoryIds.filter((id) => id !== categoryId)
      : [...filters.selectedCategoryIds, categoryId];

    updateCategoryFilter(updatedIds);
  };

  const handleAttributeChange = (value: string) => {
    const entries = filters.selectedAttributes
      ? filters.selectedAttributes.split(",").filter(Boolean)
      : [];
    const nextSet = new Set(entries);
    if (nextSet.has(value)) {
      nextSet.delete(value);
    } else {
      nextSet.add(value);
    }
    const serialized = nextSet.size > 0 ? Array.from(nextSet).join(",") : undefined;
    updateAttributeFilter(serialized);
  };

  const buildCategoryOptions = (group: FilterGroup) =>
    group.options
      .filter((option) => typeof option.categoryId === "number")
      .map((option) => ({
        label: option.label,
        value: String(option.categoryId),
        checked: filters.selectedCategoryIds.includes(option.categoryId!),
      }));

  const buildAttributeOptions = (group: FilterGroup) =>
    group.options.map((option) => {
      const serializedValue = `${option.attributeId}:${option.optionId}`;
      return {
        label: option.label,
        value: serializedValue,
        checked: selectedAttributeSet.has(serializedValue),
      };
    });

  const renderCategoryGroups = () => {
    if (!categoryGroups.length) {
      return null;
    }

    return categoryGroups.map((group, index) => (
      <React.Fragment key={group.key}>
        {index > 0 && <Line />}
        <CheckboxGroup
          title={group.title}
          options={buildCategoryOptions(group)}
          onChange={handleCategoryChange}
        />
      </React.Fragment>
    ));
  };

  const renderAttributeGroups = () => {
    if (!attributeGroups.length) {
      return null;
    }

    return attributeGroups.map((group, index) => (
      <React.Fragment key={group.key}>
        {index > 0 && <Line />}
        <CheckboxGroup
          title={group.title}
          options={buildAttributeOptions(group)}
          onChange={handleAttributeChange}
        />
      </React.Fragment>
    ));
  };

  const showSkeleton = filtersLoading;
  const showError = !filtersLoading && !!filtersError;
  const canRenderGroups = !filtersLoading && !filtersError;

  return (
    <SidebarWrapper>
      <Title>{dictionary.title}</Title>
      <Line />
      {showSkeleton && <FiltersLoadingSkeleton sections={2} rowsPerSection={4} />}
      {showError && <SectionMessage>{filtersError}</SectionMessage>}
      {canRenderGroups && renderCategoryGroups()}
      <Line />
      <PriceFilter dictionary={dictionary} />
      <StyledInputs>
        <PriceInput text="დან" type="min" />
        <PriceInput text="მდე" type="max" />
      </StyledInputs>
      <PriceRangeSlider min={0} max={10000} />
      {canRenderGroups && attributeGroups.length > 0 && (
        <>
          <Line />
          {renderAttributeGroups()}
        </>
      )}
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
