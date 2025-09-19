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
        options.push({
          label: category.name,
          value: category.id.toString(),
          checked: filters.selectedCategoryIds.includes(category.id),
        });

        // Add subcategories if they exist
        if (category.subcategories && Array.isArray(category.subcategories)) {
          category.subcategories.forEach((subcategory: any) => {
            options.push({
              label: `${subcategory.name}`, // Use bullet point for subcategories
              value: subcategory.id.toString(),
              checked: filters.selectedCategoryIds.includes(subcategory.id),
            });
          });
        }
      });

      setCategoryOptions(options);
    }
  }, [categories, filters.selectedCategoryIds]);

  const handleCategoryChange = (val: string) => {
    const categoryId = parseInt(val, 10);
    const isCurrentlySelected = filters.selectedCategoryIds.includes(categoryId);

    let newSelectedIds;
    if (isCurrentlySelected) {
      // Remove category from selection
      newSelectedIds = filters.selectedCategoryIds.filter((id) => id !== categoryId);
    } else {
      // Add category to selection
      newSelectedIds = [...filters.selectedCategoryIds, categoryId];
    }

    updateCategoryFilter(newSelectedIds);
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
