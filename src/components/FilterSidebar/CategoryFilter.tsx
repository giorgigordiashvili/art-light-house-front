"use client";
import React, { useEffect, useState } from "react";
import CheckboxGroup from "./CheckboxGroup";
import { CategoryService, Category } from "@/lib/categoryService";
import { useTranslations } from "@/hooks/useTranslations";

interface CategoryOption {
  label: string;
  value: string;
  checked?: boolean;
}

function CategoryFilter({ dictionary }: any) {
  const { currentLanguage } = useTranslations();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list: Category[] = await CategoryService.getCategories(currentLanguage as any);
        if (cancelled) return;
        const mapped: CategoryOption[] = list.map((c) => ({ label: c.title, value: String(c.id) }));
        setCategories(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load categories");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentLanguage]);

  const handleCategoryChange = (val: string) => {
    setCategories((prev) => prev.map((c) => (c.value === val ? { ...c, checked: !c.checked } : c)));
  };

  if (loading) {
    return (
      <CheckboxGroup title={dictionary.subTitle1} options={[]} onChange={handleCategoryChange} />
    );
  }
  if (error) {
    return (
      <CheckboxGroup
        title={dictionary.subTitle1}
        options={[{ label: error, value: "__error", checked: false }]}
        onChange={handleCategoryChange}
      />
    );
  }

  return (
    <CheckboxGroup
      title={dictionary.subTitle1}
      options={categories}
      onChange={handleCategoryChange}
    />
  );
}

export default CategoryFilter;
