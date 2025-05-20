"use client";
import React, { useEffect, useState } from "react";
import CheckboxGroup from "./CheckboxGroup";
import { useLanguage } from "@/context/LanguageContext";

function StyleFilter() {
  const { dictionary } = useLanguage();
  const [categories, setCategories] = useState([
    { label: dictionary.products.filter.filterOption8, value: "Modern" },
    { label: dictionary.products.filter.filterOption9, value: "Classic", checked: true },
    { label: dictionary.products.filter.filterOption10, value: "Industrial" },
    { label: dictionary.products.filter.filterOption12, value: "Boho" },
    { label: dictionary.products.filter.filterOption13, value: "Scandinavian" },
  ]);

  useEffect(() => {
    setCategories([
      {
        label: dictionary.products.filter.filterOption8,
        value: "Modern",
        checked: categories[0]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption9,
        value: "Classic",
        checked: categories[1]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption10,
        value: "Industrial",
        checked: categories[2]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption12,
        value: "Boho",
        checked: categories[3]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption13,
        value: "Scandinavian",
        checked: categories[4]?.checked,
      },
    ]);
    // eslint-disable-next-line
  }, [dictionary]);

  const handleCategoryChange = (val: string) => {
    setCategories((prev) => prev.map((c) => (c.value === val ? { ...c, checked: !c.checked } : c)));
  };

  return (
    <CheckboxGroup
      title={dictionary.products.filter.subTitle3}
      options={categories}
      onChange={handleCategoryChange}
    />
  );
}

export default StyleFilter;
