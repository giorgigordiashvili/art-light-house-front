"use client";
import React, { useState } from "react";
import CheckboxGroup from "./CheckboxGroup";

function TypeFilter() {
  const [categories, setCategories] = useState([
    { label: "LED", value: "LED" },
    { label: "Halogen", value: "Halogen", checked: true },
    { label: "Edison", value: "Edison" },
    { label: "კომპაქტური ფლუორესცენტური", value: "Compact fluorescent" },
    { label: "RGB განათება", value: "RGB lighting" },
  ]);

  const handleCategoryChange = (val: string) => {
    setCategories((prev) => prev.map((c) => (c.value === val ? { ...c, checked: !c.checked } : c)));
  };

  return (
    <CheckboxGroup title="განათების ტიპი" options={categories} onChange={handleCategoryChange} />
  );
}

export default TypeFilter;
