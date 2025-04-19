"use client";
import React, { useState } from "react";
import CheckboxGroup from "./CheckboxGroup";

function CategoryFilter() {
  const [categories, setCategories] = useState([
    { label: "ჭაღი", value: "Chandelier" },
    { label: "ჭერზე დასამაგრებელი", value: "Ceiling mount", checked: true },
    { label: "ჩამოსაკიდი", value: "Hanging" },
    { label: "კედლის სანათი", value: "wall-light" },
    { label: "აბაზანის განათება", value: "Bathroom lighting" },
    { label: "სანათი მაგიდისთვის", value: "Table lamp" },
    { label: "სამუშაო განათება", value: "Work lighting" },
  ]);

  const handleCategoryChange = (val: string) => {
    setCategories((prev) => prev.map((c) => (c.value === val ? { ...c, checked: !c.checked } : c)));
  };

  return <CheckboxGroup title="კატეგორია" options={categories} onChange={handleCategoryChange} />;
}

export default CategoryFilter;
