"use client";
import React, { useState, useEffect } from "react";
import CheckboxGroup from "./CheckboxGroup";
// TODO: Attributes endpoint not available in new API - need backend implementation
// import { apiEcommerceClientAttributesList } from "@/api/generated/api";
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
  const [baseOptions, setBaseOptions] = useState<CheckboxOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters, updateAttributeFilter } = useFilterContext();

  // Module-level cache for all attributes (no category filter here)
  const g = globalThis as unknown as {
    __attributesCache?: { data: Attribute[] | null; promise: Promise<Attribute[]> | null };
  };
  if (!g.__attributesCache) {
    g.__attributesCache = { data: null, promise: null };
  }

  // Fetch once (or reuse cache), build base options for this attributeName
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        // TODO: Attributes endpoint not available in new API
        // Need backend to implement apiEcommerceClientAttributesList
        // For now, return empty array to prevent errors
        const attributes: Attribute[] = [];

        /* When API is available, uncomment:
        const cache = g.__attributesCache!;
        let attributes: Attribute[];
        if (cache.data) {
          attributes = cache.data;
        } else if (cache.promise) {
          attributes = await cache.promise;
        } else {
          cache.promise = apiEcommerceClientAttributesList();
          attributes = await cache.promise;
          cache.data = attributes;
          cache.promise = null;
        }
        */

        if (cancelled) return;

        const targetAttributes = attributes.filter(
          (attr: Attribute) =>
            attr.values && attr.values.length > 0 && attr.values[0].value === attributeName
        );

        const base: CheckboxOption[] = targetAttributes.map((attr: Attribute) => ({
          label: attr.name,
          value: `${attr.id}:${attr.values[0].id}`,
        }));
        setBaseOptions(base);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [attributeName]);

  // When selection changes, just toggle checked flags; no refetch
  useEffect(() => {
    const selectedPairs = filters.selectedAttributes ? filters.selectedAttributes.split(",") : [];
    const mapped = baseOptions.map((opt) => ({
      ...opt,
      checked: selectedPairs.includes(opt.value),
    }));
    setOptions(mapped);
  }, [baseOptions, filters.selectedAttributes]);

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
