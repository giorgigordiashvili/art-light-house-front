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
  // Latest filters, so the debounced commit never uses values from an old render
  const filtersRef = React.useRef(filters);
  filtersRef.current = filters;

  React.useEffect(() => {
    const currentValue = type === "min" ? filters.minPrice : filters.maxPrice;
    setLocalValue(currentValue !== undefined ? currentValue.toString() : "");
  }, [filters.minPrice, filters.maxPrice, type]);

  // Cleanup debounce timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const clearPendingDebounce = () => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  // Apply the value to the filters once; skips no-op updates
  const commit = (value: string) => {
    clearPendingDebounce();
    const next = value === "" ? undefined : parseInt(value, 10);
    if (next !== undefined && isNaN(next)) return;

    const latest = filtersRef.current;
    const current = type === "min" ? latest.minPrice : latest.maxPrice;
    if (next === current) return;

    updatePriceFilter(
      type === "min" ? next : latest.minPrice,
      type === "max" ? next : latest.maxPrice
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setLocalValue(value);

      // Debounce immediate filter updates to avoid excessive requests
      clearPendingDebounce();
      debounceRef.current = window.setTimeout(() => {
        debounceRef.current = null;
        commit(value);
      }, 300);
    }
  };

  const handleBlur = () => {
    commit(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commit(localValue);
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
