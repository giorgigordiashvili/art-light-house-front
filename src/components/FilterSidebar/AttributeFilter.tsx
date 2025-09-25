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
          const attributeOptions: CheckboxOption[] = targetAttributes.map((attr: Attribute) => ({
            label: attr.name, // The actual attribute name (like "EDISON", "LED", etc.)
            value: `${attr.id}:${attr.values[0].id}`, // format: attr_id:value_id
            checked: false,
          }));
          setOptions(attributeOptions);
        }
      } catch (error) {
        console.error(`Error fetching attributes for ${attributeName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [attributeName]);

  // Parse current selected attributes to determine which checkboxes should be checked
  useEffect(() => {
    if (filters.selectedAttributes) {
      const selectedPairs = filters.selectedAttributes.split(",");
      setOptions((prev) =>
        prev.map((option) => ({
          ...option,
          checked: selectedPairs.includes(option.value),
        }))
      );
    } else {
      setOptions((prev) =>
        prev.map((option) => ({
          ...option,
          checked: false,
        }))
      );
    }
  }, [filters.selectedAttributes]);

  const handleOptionChange = (value: string) => {
    const updatedOptions = options.map((option) =>
      option.value === value ? { ...option, checked: !option.checked } : option
    );
    setOptions(updatedOptions);

    // Build the attributes string in the format: attr_id:value_id,attr_id:value_id
    const selectedValues = updatedOptions
      .filter((option) => option.checked)
      .map((option) => option.value);

    // Combine with existing attributes from other AttributeFilter components
    const currentAttributes = filters.selectedAttributes
      ? filters.selectedAttributes.split(",")
      : [];

    // Remove old values for this attribute type by checking if any current options match
    const currentOptionValues = options.map((opt) => opt.value);
    const otherAttributeValues = currentAttributes.filter(
      (attr) => !currentOptionValues.includes(attr)
    );

    // Combine with new selected values for this attribute
    const allSelectedValues = [...otherAttributeValues, ...selectedValues].filter(
      (v) => v.length > 0
    );

    const attributesString = allSelectedValues.length > 0 ? allSelectedValues.join(",") : undefined;
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
