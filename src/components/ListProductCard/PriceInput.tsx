"use client";
import React from "react";
import Styled from "styled-components";
import { useFilterContext } from "@/contexts/FilterContext";

type Props = {
  text: string;
  type: "min" | "max";
};

const StyledInput = Styled.input`
  background-color: #111111;   
  border: 1px solid #333333;
  border-radius: 8px;
  color: #ffffff;
  padding: 10px 12px;
  font-size: 14px; 
  width: 131px;
  height: 38px;
  cursor: pointer;
  outline: none;

  &::placeholder {
    color: #777777;
  }

  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const PriceInput: React.FC<Props> = ({ text, type }) => {
  const { filters, updatePriceFilter } = useFilterContext();
  const [localValue, setLocalValue] = React.useState<string>("");
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const currentValue = type === "min" ? filters.minPrice : filters.maxPrice;
    setLocalValue(currentValue !== undefined ? currentValue.toString() : "");
  }, [filters.minPrice, filters.maxPrice, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setLocalValue(value);

      // Debounce immediate filter updates to avoid excessive requests
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }

      debounceRef.current = window.setTimeout(() => {
        const numValue = value === "" ? undefined : parseInt(value, 10);
        if (type === "min") {
          updatePriceFilter(numValue, filters.maxPrice);
        } else {
          updatePriceFilter(filters.minPrice, numValue);
        }
      }, 300);
    }
  };

  const handleBlur = () => {
    if (localValue === "") {
      updatePriceFilter(
        type === "min" ? undefined : filters.minPrice,
        type === "max" ? undefined : filters.maxPrice
      );
      return;
    }

    const numValue = parseInt(localValue, 10);
    if (!isNaN(numValue)) {
      if (type === "min") {
        updatePriceFilter(numValue, filters.maxPrice);
      } else {
        updatePriceFilter(filters.minPrice, numValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <StyledInput
      placeholder={text}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      type="text"
      inputMode="numeric"
    />
  );
};

export default PriceInput;
