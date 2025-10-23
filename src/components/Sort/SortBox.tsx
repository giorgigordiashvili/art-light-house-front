"use client";
import styled from "styled-components";
import { useState, useEffect } from "react";

const Box = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid #2c2c2c;
  width: 198px;
  display: flex;
  flex-direction: column;
  font-family: inherit;
  color: #fff;
  height: 100%;
  /* top: 232px;
left: 96px; */
  border-radius: 17px;
`;

const Option = styled.div<{ $active?: boolean }>`
  padding: 10px 16px;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#bcbcbc")};
  cursor: pointer;
  border-top: 1px solid #2c2c2c;

  &:first-child {
    border-top: none;
  }
`;

type Props = {
  onSortChange: (sortType: string) => void;
  dictionary: any;
  currentOrdering?: string;
};

const SortBox = ({ onSortChange, dictionary, currentOrdering }: Props) => {
  // Initialize selected based on currentOrdering
  const initializeSelected = () => {
    if (currentOrdering === "-price") {
      return dictionary.sortOption1; // Price: Descending
    } else if (currentOrdering === "price") {
      return dictionary.sortOption2; // Price: Ascending
    }
    // No default selection - return null when no ordering is applied
    return null;
  };

  const [selected, setSelected] = useState<string | null>(initializeSelected());

  // Update selected when currentOrdering changes (e.g., from URL)
  useEffect(() => {
    if (currentOrdering === "-price") {
      setSelected(dictionary.sortOption1);
    } else if (currentOrdering === "price") {
      setSelected(dictionary.sortOption2);
    } else {
      // Clear selection when no ordering
      setSelected(null);
    }
  }, [currentOrdering, dictionary.sortOption1, dictionary.sortOption2]);

  const options = [dictionary.sortOption1, dictionary.sortOption2];

  const handleClick = (option: string) => {
    setSelected(option);
    onSortChange(option);
  };

  return (
    <Box>
      {options.map((opt) => (
        <Option key={opt} $active={selected === opt} onClick={() => handleClick(opt)}>
          {opt}
        </Option>
      ))}
    </Box>
  );
};

export default SortBox;
