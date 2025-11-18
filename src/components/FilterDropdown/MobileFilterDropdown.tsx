"use client";
import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import Line from "../FilterSidebar/Line";
import PriceFilter from "../FilterSidebar/PriceFilter";
import ButtonFilter from "./ButtonFilter";
import PriceRangeSlider from "../FilterSidebar/PriceRangeSlider";
import PriceInput from "@/components/ListProductCard/PriceInput";
import CheckboxGroup from "../FilterSidebar/CheckboxGroup";
import { useFilterContext } from "@/contexts/FilterContext";
import { useFilterAttributeGroups, FilterGroup } from "@/hooks/useFilterAttributeGroups";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/utils/getLocaleFromPath";
import FiltersLoadingSkeleton from "../FilterSidebar/FiltersLoadingSkeleton";

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const DropdownWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 677px;
  background: #1c1c1c;
  backdrop-filter: blur(114px);
  border-radius: 20px 20px 0 0;
  z-index: 1000;
  animation: ${slideUp} 0.3s ease-out;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ScrollArea = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  scrollbar-width: none;
`;

const BottomBar = styled.div`
  width: 100%;
  background-color: #1c1c1c;
  border-top: 1px solid #313131;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.p`
  font-family: "Helvetica", sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: white;
  margin-bottom: 16px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 12px;
  font-weight: 300;
  position: absolute;
  right: 20px;
  cursor: pointer;
`;

const InputsRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
`;

const SectionMessage = styled.p`
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 20px;
`;

const SaleButton = styled.button<{ $isActive: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.$isActive ? "#ffcb40" : "transparent")};
  border: 1px solid ${(props) => (props.$isActive ? "#ffcb40" : "#ffffff20")};
  border-radius: 10px;
  font-family: HelRom;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  transition: all 0.2s ease;
  cursor: pointer;
  color: ${(props) => (props.$isActive ? "#000" : "#fff")};

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#ffcb40" : "#ffffff10")};
    border-color: ${(props) => (props.$isActive ? "#ffcb40" : "#ffffff30")};
  }
`;

interface MobileFilterDropdownProps {
  onClose: () => void;
  dictionary: any;
}

const MobileFilterDropdown: React.FC<MobileFilterDropdownProps> = ({ onClose, dictionary }) => {
  // Since filtering is now immediate, the button just closes the dropdown
  const pathname = usePathname();
  const language = getLocaleFromPath(pathname);
  const { filters, updateCategoryFilter, updateAttributeFilter, updateOnSaleFilter } =
    useFilterContext();
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

  const handleCategoryChange = (value: string) => {
    const isSelected = filters.selectedCategoryFilters.includes(value);
    const updatedFilters = isSelected
      ? filters.selectedCategoryFilters.filter((entry) => entry !== value)
      : [...filters.selectedCategoryFilters, value];

    updateCategoryFilter(updatedFilters);
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

  const handleOnSaleChange = () => {
    updateOnSaleFilter(!filters.onSale ? true : undefined);
  };

  const buildCategoryOptions = (group: FilterGroup) =>
    group.options
      .filter((option) => typeof option.categoryId === "number")
      .map((option) => {
        const serialized = `${group.key}:${option.optionId}`;
        return {
          label: option.label,
          value: serialized,
          checked: filters.selectedCategoryFilters.includes(serialized),
        };
      });

  const buildAttributeOptions = (group: FilterGroup) =>
    group.options.map((option) => {
      const serialized = `${option.attributeId}:${option.optionId}`;
      return {
        label: option.label,
        value: serialized,
        checked: selectedAttributeSet.has(serialized),
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
    <>
      <Overlay onClick={onClose} />
      <DropdownWrapper>
        <ScrollArea>
          <CloseButton onClick={onClose}>{dictionary.filter.clear}</CloseButton>
          <Title>{dictionary.filter.title}</Title>
          <Line />
          {showSkeleton && <FiltersLoadingSkeleton sections={2} rowsPerSection={4} compact />}
          {showError && <SectionMessage>{filtersError}</SectionMessage>}
          {canRenderGroups && renderCategoryGroups()}
          <PriceFilter dictionary={dictionary.filter} />
          <InputsRow>
            <PriceInput text={dictionary.filter?.placeholder1 ?? "დან"} type="min" />
            <PriceInput text={dictionary.filter?.placeholder2 ?? "მდე"} type="max" />
          </InputsRow>
          <PriceRangeSlider min={0} max={10000} />
          {canRenderGroups && attributeGroups.length > 0 && (
            <>
              <Line />
              {renderAttributeGroups()}
            </>
          )}
        </ScrollArea>

        <BottomBar>
          <SaleButton $isActive={!!filters.onSale} onClick={handleOnSaleChange}>
            {dictionary?.filter?.onSaleLabel || "ფასდაკლებული პროდუქტები"}
          </SaleButton>
          <ButtonFilter onClick={onClose} dictionary={dictionary} />
        </BottomBar>
      </DropdownWrapper>
    </>
  );
};

export default MobileFilterDropdown;
