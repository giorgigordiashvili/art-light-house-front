"use client";
import React, { useEffect, useState } from "react";
import CheckboxGroup from "./CheckboxGroup";
import { useLanguage } from "@/context/LanguageContext";

function TypeFilter() {
  const { dictionary } = useLanguage();
  const [categories, setCategories] = useState([
    { label: dictionary.products.filter.filterOption14, value: "LED" },
    { label: dictionary.products.filter.filterOption15, value: "Halogen", checked: true },
    { label: dictionary.products.filter.filterOption16, value: "Edison" },
    { label: dictionary.products.filter.filterOption17, value: "Compact fluorescent" },
    { label: dictionary.products.filter.filterOption18, value: "RGB lighting" },
  ]);

  useEffect(() => {
    setCategories([
      {
        label: dictionary.products.filter.filterOption14,
        value: "LED",
        checked: categories[0]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption15,
        value: "Halogen",
        checked: categories[1]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption16,
        value: "Edison",
        checked: categories[2]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption17,
        value: "Compact fluorescent",
        checked: categories[3]?.checked,
      },
      {
        label: dictionary.products.filter.filterOption18,
        value: "RGB lighting",
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
      title={dictionary.products.filter.subTitle4}
      options={categories}
      onChange={handleCategoryChange}
    />
  );
}

export default TypeFilter;
