"use client";
import React, { useState, useEffect } from "react";
import CheckboxGroup from "./CheckboxGroup";
import { attributeList } from "@/api/generated/api";
import { Attribute } from "@/api/generated/interfaces";
import { useFilterContext } from "@/contexts/FilterContext";

interface AttributeFilterProps {
  attributeName: string; // "სტილი" or "განათების ტიპი"
  title: string; // Dictionary title to display
}

interface CheckboxOption {
  label: string;
  value: string; // format: "attr_id:value_id"
  checked?: boolean;
}

function AttributeFilter({ attributeName, title }: AttributeFilterProps) {
  const [options, setOptions] = useState<CheckboxOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters, updateAttributeFilter } = useFilterContext();

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        setLoading(true);
        const attributes = await attributeList();

        // Filter attributes that have the target type in their values
        const targetAttributes = attributes.filter(
          (attr: Attribute) =>
            attr.values && attr.values.length > 0 && attr.values[0].value === attributeName
        );

        if (targetAttributes.length > 0) {
          // Get currently selected attributes from filter context
          const selectedPairs = filters.selectedAttributes
            ? filters.selectedAttributes.split(",")
            : [];

          const attributeOptions: CheckboxOption[] = targetAttributes.map((attr: Attribute) => {
            const value = `${attr.id}:${attr.values[0].id}`;
            return {
              label: attr.name, // The actual attribute name (like "EDISON", "LED", etc.)
              value, // format: attr_id:value_id
              checked: selectedPairs.includes(value), // Preserve checked state from filter context
            };
          });
          setOptions(attributeOptions);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [attributeName, filters.selectedAttributes]); // Add filters.selectedAttributes as dependency

  const handleOptionChange = (value: string) => {
    // Find the current checked state for this value
    const currentOption = options.find((opt) => opt.value === value);
    const newCheckedState = !currentOption?.checked;

    // Update local state immediately for responsive UI
    setOptions((prev) =>
      prev.map((option) =>
        option.value === value ? { ...option, checked: newCheckedState } : option
      )
    );

    // Build the attributes string in the format: attr_id:value_id,attr_id:value_id
    const currentAttributes = filters.selectedAttributes
      ? filters.selectedAttributes.split(",").filter((attr) => attr.trim())
      : [];

    let updatedAttributes: string[];

    if (newCheckedState) {
      // Add the value if it's being checked
      updatedAttributes = [...currentAttributes, value];
    } else {
      // Remove the value if it's being unchecked
      updatedAttributes = currentAttributes.filter((attr) => attr !== value);
    }

    // Update the filter context
    const attributesString = updatedAttributes.length > 0 ? updatedAttributes.join(",") : undefined;
    updateAttributeFilter(attributesString);
  };

  if (loading) {
    return <div style={{ color: "white", padding: "10px" }}>Loading {attributeName}...</div>;
  }

  if (options.length === 0) {
    return null; // Don't render if no options available
  }

  return <CheckboxGroup title={title} options={options} onChange={handleOptionChange} />;
}

export default AttributeFilter;
