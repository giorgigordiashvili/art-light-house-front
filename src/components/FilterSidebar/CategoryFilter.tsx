"use client";
import React, { useEffect, useState } from "react";
import CheckboxGroup from "./CheckboxGroup";
import { useLanguage } from "@/context/LanguageContext";

function CategoryFilter() {
  const { dictionary } = useLanguage();
  const [categories, setCategories] = useState([
    { label: dictionary.products.filter.filterOption1, value: "Chandelier" },
    { label: dictionary.products.filter.filterOption2, value: "Ceiling mount", checked: true },
    { label: dictionary.products.filter.filterOption3, value: "Hanging" },
    { label: dictionary.products.filter.filterOption4, value: "wall-light" },
    { label: dictionary.products.filter.filterOption5, value: "Bathroom lighting" },
    { label: dictionary.products.filter.filterOption6, value: "Table lamp" },
    { label: dictionary.products.filter.filterOption7, value: "Work lighting" },
  ]);

  // Update categories when language changes
  useEffect(() => {
    setCategories([
      {
        label: dictionary.products.filter.filterOption1,
        value: "Chandelier",
        checked: categories[0]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption2,
        value: "Ceiling mount",
        checked: categories[1]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption3,
        value: "Hanging",
        checked: categories[2]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption4,
        value: "wall-light",
        checked: categories[3]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption5,
        value: "Bathroom lighting",
        checked: categories[4]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption6,
        value: "Table lamp",
        checked: categories[5]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption7,
        value: "Work lighting",
        checked: categories[6]?.checked,
      },
    ]);
    // eslint-disable-next-line
  }, [dictionary]);

  const handleCategoryChange = (val: string) => {
    setCategories((prev) => prev.map((c) => (c.value === val ? { ...c, checked: !c.checked } : c)));
  };

  return (
    <CheckboxGroup
      title={dictionary.products.filter.subTitle1}
      options={categories}
      onChange={handleCategoryChange}
    />
  );
}

export default CategoryFilter;
