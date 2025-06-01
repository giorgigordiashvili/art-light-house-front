"use client";
import React, { useState } from "react";
import CheckboxGroup from "./CheckboxGroup";

function TypeFilter({ dictionary }: any) {
  const [categories, setCategories] = useState([
    { label: dictionary.filterOption14, value: "LED" },
    { label: dictionary.filterOption15, value: "Halogen", checked: true },
    { label: dictionary.filterOption16, value: "Edison" },
    { label: dictionary.filterOption17, value: "Compact fluorescent" },
    { label: dictionary.filterOption18, value: "RGB lighting" },
  ]);

  const handleCategoryChange = (val: string) => {
    setCategories((prev) => prev.map((c) => (c.value === val ? { ...c, checked: !c.checked } : c)));
  };

  return (
    <CheckboxGroup
      title={dictionary.subTitle4}
      options={categories}
      onChange={handleCategoryChange}
    />
  );
}

export default TypeFilter;
