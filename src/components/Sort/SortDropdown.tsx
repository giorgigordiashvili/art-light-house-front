"use client";
import { useState } from "react";
import styled from "styled-components";
import SortButton from "./SortButtom";
import SortBox from "./SortBox";
import { useFilterContext } from "@/contexts/FilterContext";

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownWrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 10;
`;

interface SortDropdownProps {
  dictionary: any;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ dictionary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { updateOrdering, filters } = useFilterContext();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Get the current selected text based on ordering
  const getSelectedText = () => {
    if (filters.ordering === "-price") {
      return dictionary.sortOption1;
    } else if (filters.ordering === "price") {
      return dictionary.sortOption2;
    }
    return null;
  };

  const handleSortChange = (sortType: string) => {
    setIsOpen(false);

    // Map dictionary options to API ordering values
    let ordering: string | undefined;

    if (sortType === dictionary.sortOption1) {
      // Price: Descending (კლებადობით)
      ordering = "-price";
    } else if (sortType === dictionary.sortOption2) {
      // Price: Ascending (ზრდადობით)
      ordering = "price";
    }

    updateOrdering(ordering);
  };

  return (
    <Wrapper>
      <SortButton
        onClick={toggleDropdown}
        dictionary={dictionary}
        selectedText={getSelectedText()}
      />
      {isOpen && (
        <DropdownWrapper>
          <SortBox
            onSortChange={handleSortChange}
            dictionary={dictionary}
            currentOrdering={filters.ordering}
          />
        </DropdownWrapper>
      )}
    </Wrapper>
  );
};

export default SortDropdown;
