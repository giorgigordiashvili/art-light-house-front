"use client";
import React, { useState } from "react";
import CheckboxGroup from "./CheckboxGroup";

function StyleFilter() {
  const [categories, setCategories] = useState([
    { label: "მოდერნი", value: "Modern" },
    { label: "კლასიკური", value: "Classic", checked: true },
    { label: "ინდუსტრიული", value: "Industrial" },
    { label: "ბოჰო", value: "Boho" },
    { label: "სკანდინავიური", value: "Scandinavian" },
  ]);

  const handleCategoryChange = (val: string) => {
    setCategories((prev) => prev.map((c) => (c.value === val ? { ...c, checked: !c.checked } : c)));
  };

  return <CheckboxGroup title="სტილი" options={categories} onChange={handleCategoryChange} />;
}

export default StyleFilter;
