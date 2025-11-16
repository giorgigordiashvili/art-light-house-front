"use client";
import React, { useState, useEffect } from "react";
import CheckboxGroup from "./CheckboxGroup";
import { useCategories } from "../../hooks/useCategories";
import { CheckboxOption } from "./types";
import { Category } from "@/api/generated/interfaces";
import { useFilterContext } from "../../contexts/FilterContext";

interface CategoryFilterProps {
  dictionary: any;
}

function CategoryFilter({ dictionary }: CategoryFilterProps) {
  const { categories, loading, error } = useCategories();
  const { filters, updateCategoryFilter } = useFilterContext();
  const [categoryOptions, setCategoryOptions] = useState<CheckboxOption[]>([]);

  // Transform API categories to CheckboxOption format - only using name field
  useEffect(() => {
    if (categories.length > 0) {
      const options: CheckboxOption[] = [];

      categories.forEach((category: Category) => {
        // Add main category
        const serializedValue = `category:${category.id}`;
        options.push({
          label: category.name,
          value: serializedValue,
          checked: filters.selectedCategoryFilters.includes(serializedValue),
        });

        // Add subcategories if they exist
        if (category.subcategories && Array.isArray(category.subcategories)) {
          category.subcategories.forEach((subcategory: any) => {
            const subValue = `category:${subcategory.id}`;
            options.push({
              label: `${subcategory.name}`,
              value: subValue,
              checked: filters.selectedCategoryFilters.includes(subValue),
            });
          });
        }
      });

      setCategoryOptions(options);
    }
  }, [categories, filters.selectedCategoryFilters]);

  const handleCategoryChange = (val: string) => {
    const isCurrentlySelected = filters.selectedCategoryFilters.includes(val);

    let newSelections;
    if (isCurrentlySelected) {
      newSelections = filters.selectedCategoryFilters.filter((entry) => entry !== val);
    } else {
      newSelections = [...filters.selectedCategoryFilters, val];
    }

    updateCategoryFilter(newSelections);
  };

  if (loading) {
    return (
      <CheckboxGroup
        title={dictionary.subTitle1}
        options={[{ label: "Loading categories...", value: "loading", checked: false }]}
        onChange={() => {}}
      />
    );
  }

  if (error) {
    return (
      <CheckboxGroup
        title={dictionary.subTitle1}
        options={[{ label: "Error loading categories", value: "error", checked: false }]}
        onChange={() => {}}
      />
    );
  }

  return (
    <CheckboxGroup
      title={dictionary.subTitle1}
      options={categoryOptions}
      onChange={handleCategoryChange}
    />
  );
}

export default CategoryFilter;
