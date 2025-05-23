"use client";
import React, { useState } from "react";
import CheckboxGroup from "./CheckboxGroup";

function CategoryFilter({ dictionary }) {
  const [categories, setCategories] = useState([
    { label: dictionary.filterOption1, value: "Chandelier" },
    { label: dictionary.filterOption2, value: "Ceiling mount", checked: true },
    { label: dictionary.filterOption3, value: "Hanging" },
    { label: dictionary.filterOption4, value: "wall-light" },
    { label: dictionary.filterOption5, value: "Bathroom lighting" },
    { label: dictionary.filterOption6, value: "Table lamp" },
    { label: dictionary.filterOption7, value: "Work lighting" },
  ]);

  const handleCategoryChange = (val: string) => {
    setCategories((prev) => prev.map((c) => (c.value === val ? { ...c, checked: !c.checked } : c)));
  };

  return (
    <CheckboxGroup
      title={dictionary.subTitle1}
      options={categories}
      onChange={handleCategoryChange}
    />
  );
}

export default CategoryFilter;
