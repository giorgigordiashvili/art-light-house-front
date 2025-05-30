"use client";
import React, { useState } from "react";
import CheckboxGroup from "./CheckboxGroup";

function StyleFilter({ dictionary }: any) {
  const [categories, setCategories] = useState([
    { label: dictionary.filterOption8, value: "Modern" },
    { label: dictionary.filterOption9, value: "Classic", checked: true },
    { label: dictionary.filterOption10, value: "Industrial" },
    { label: dictionary.filterOption11, value: "Boho" },
    { label: dictionary.filterOption12, value: "Scandinavian" },
  ]);

  const handleCategoryChange = (val: string) => {
    setCategories((prev) => prev.map((c) => (c.value === val ? { ...c, checked: !c.checked } : c)));
  };

  return (
    <CheckboxGroup
      title={dictionary.subTitle3}
      options={categories}
      onChange={handleCategoryChange}
    />
  );
}

export default StyleFilter;
