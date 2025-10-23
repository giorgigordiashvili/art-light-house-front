"use client";
import { useState, useEffect } from "react";
import {
  AdminAttribute,
  AdminCategory,
  AttributeTranslationRequest,
} from "@/api/generated/interfaces";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Select,
  CheckboxWrapper,
  Checkbox,
  CheckboxLabel,
  ErrorMessage,
  HelperText,
} from "@/components/NewAdmin/ui/Form";
import { Button } from "@/components/NewAdmin/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/NewAdmin/ui/Card";
import styled from "styled-components";
import adminAxios from "@/api/admin-axios";

const TranslationCard = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  margin-bottom: 16px;
`;

const TranslationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TranslationTitle = styled.h4`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #c82333;
  }
`;

const AddTranslationButton = styled(Button)`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #e7f3ff;
  color: #0066cc;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  margin: 4px;

  button {
    background: none;
    border: none;
    color: #0066cc;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    line-height: 1;

    &:hover {
      color: #004499;
    }
  }
`;

const CategoryTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
  min-height: 32px;
`;

interface FormData {
  name: string;
  attribute_type: "text" | "number" | "boolean" | "choice" | "color" | "size";
  is_required: boolean;
  is_filterable: boolean;
  parent?: number;
  categories: number[];
  translations: AttributeTranslationRequest[];
  placement_hint?: string;
}

interface AttributeFormProps {
  initialData?: AdminAttribute | null;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const AttributeForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: AttributeFormProps) => {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  // Using a multi-select for categories, no need for an intermediate selection state

  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      const derivedPlacement =
        initialData.name === "განათების ტიპი" || initialData.name === "სტილი"
          ? (initialData.name as string)
          : "";
      return {
        name: initialData.name || "",
        attribute_type: (initialData.attribute_type as any) || "text",
        is_required: initialData.is_required ?? false,
        is_filterable: initialData.is_filterable ?? true,
        parent: initialData.parent || undefined,
        categories: initialData.categories || [],
        translations: initialData.translations || [],
        placement_hint: derivedPlacement,
      };
    }

    return {
      name: "",
      attribute_type: "text",
      is_required: false,
      is_filterable: true,
      categories: [],
      translations: [],
      placement_hint: "",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await adminAxios.get("/api/products/admin/categories/");
        setCategories(response.data);
      } catch {
        // Silent error handling
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const attributeTypes = [
    { value: "text", label: "Text", description: "Free text input" },
    { value: "number", label: "Number", description: "Numeric values" },
    { value: "boolean", label: "Boolean", description: "Yes/No or True/False" },
    { value: "choice", label: "Choice", description: "Select from predefined options" },
    { value: "color", label: "Color", description: "Color picker or color values" },
    { value: "size", label: "Size", description: "Size options (XS, S, M, L, XL, etc.)" },
  ];

  // Translation handlers
  const addTranslation = () => {
    setFormData((prev) => ({
      ...prev,
      translations: [
        ...prev.translations,
        {
          language_code: {} as any,
          name: "",
        },
      ],
    }));
  };

  const removeTranslation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index),
    }));
  };

  const handleTranslationChange = (
    index: number,
    field: keyof AttributeTranslationRequest,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((translation, i) =>
        i === index ? { ...translation, [field]: value } : translation
      ),
    }));
  };

  // Category handlers

  const removeCategory = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : `Category #${categoryId}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Attribute name is required";
    }

    if (!formData.attribute_type) {
      newErrors.attribute_type = "Attribute type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getTypeDescription = (type: string) => {
    const typeInfo = attributeTypes.find((t) => t.value === type);
    return typeInfo ? typeInfo.description : "";
  };

  const supportsValues = ["choice", "color", "size"].includes(formData.attribute_type);

  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <h2>Basic Information</h2>
        </CardHeader>
        <CardContent>
          <FormGroup>
            <Label>Attribute Name *</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "error" : ""}
              placeholder="Enter attribute name (e.g., Color, Size, Material)"
              required
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Attribute Type *</Label>
            <Select
              name="attribute_type"
              value={formData.attribute_type}
              onChange={handleInputChange}
              className={errors.attribute_type ? "error" : ""}
              required
            >
              {attributeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            {errors.attribute_type && <ErrorMessage>{errors.attribute_type}</ErrorMessage>}
            <HelperText>{getTypeDescription(formData.attribute_type)}</HelperText>
          </FormGroup>

          <FormGroup>
            <Label>Attribute Values</Label>
            <Input
              name="placement_hint"
              value={formData.placement_hint || ""}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  placement_hint: val,
                  // If admin enters one of the known keys and name is empty, set name to ensure placement
                  name:
                    (!prev.name || prev.name.trim() === "") &&
                    (val === "განათების ტიპი" || val === "სტილი")
                      ? val
                      : prev.name,
                }));
              }}
              placeholder='Enter "განათების ტიპი" (middle) or "სტილი" (bottom)'
            />
            <HelperText>
              Type &quot;განათების ტიპი&quot; to show this attribute in the middle of the filters,
              or &quot;სტილი&quot; to show it in the bottom. If the name is empty, it will be set
              automatically to match your choice for correct placement.
            </HelperText>
          </FormGroup>

          {supportsValues && (
            <div
              style={{
                background: "#f8f9fa",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", fontSize: "0.875rem", fontWeight: 600 }}>
                Values Configuration
              </h4>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6c757d" }}>
                After creating this attribute, you&apos;ll be able to manage its values (add, edit,
                remove options).
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Categories</h2>
        </CardHeader>
        <CardContent>
          <HelperText style={{ marginBottom: "16px" }}>
            Select which categories this attribute applies to. If no category is selected, the
            attribute will be available for all products.
          </HelperText>

          <FormGroup>
            <Label>Select Categories</Label>
            <Select
              multiple
              value={formData.categories.map(String)}
              onChange={(e) => {
                const selected = Array.from((e.target as HTMLSelectElement).selectedOptions)
                  .map((o) => parseInt(o.value, 10))
                  .filter((id) => !Number.isNaN(id));
                // de-duplicate and set
                const unique = Array.from(new Set(selected));
                setFormData((prev) => ({ ...prev, categories: unique }));
              }}
              disabled={loadingCategories}
              style={{ minHeight: "140px" }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <HelperText>Hold Ctrl/Cmd to select multiple categories</HelperText>
          </FormGroup>

          {formData.categories.length > 0 && (
            <div>
              <Label>Selected Categories</Label>
              <CategoryTagsContainer>
                {formData.categories.map((categoryId) => (
                  <CategoryTag key={categoryId}>
                    {getCategoryName(categoryId)}
                    <button type="button" onClick={() => removeCategory(categoryId)}>
                      ×
                    </button>
                  </CategoryTag>
                ))}
              </CategoryTagsContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Configuration</h2>
        </CardHeader>
        <CardContent>
          <FormGroup>
            <CheckboxWrapper>
              <Checkbox
                name="is_required"
                checked={formData.is_required}
                onChange={handleInputChange}
              />
              <CheckboxLabel>Required Attribute</CheckboxLabel>
            </CheckboxWrapper>
            <HelperText>If checked, this attribute must be specified for all products</HelperText>
          </FormGroup>

          <FormGroup>
            <CheckboxWrapper>
              <Checkbox
                name="is_filterable"
                checked={formData.is_filterable}
                onChange={handleInputChange}
              />
              <CheckboxLabel>Show in Filters</CheckboxLabel>
            </CheckboxWrapper>
            <HelperText>If checked, customers can filter products by this attribute</HelperText>
          </FormGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Translations</h2>
        </CardHeader>
        <CardContent>
          <HelperText style={{ marginBottom: "16px" }}>
            Add translations for different languages. This will allow the attribute name to be
            displayed in multiple languages.
          </HelperText>

          {formData.translations.map((translation, index) => (
            <TranslationCard key={index}>
              <TranslationHeader>
                <TranslationTitle>Translation #{index + 1}</TranslationTitle>
                <RemoveButton
                  type="button"
                  onClick={() => removeTranslation(index)}
                  title="Remove translation"
                >
                  ×
                </RemoveButton>
              </TranslationHeader>

              <FormGroup>
                <Label>Language Code *</Label>
                <Select
                  value={String(translation.language_code || "")}
                  onChange={(e) => handleTranslationChange(index, "language_code", e.target.value)}
                  required
                >
                  <option value="">Select language</option>
                  <option value="en">English (en)</option>
                  <option value="ka">Georgian (ka)</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Name *</Label>
                <Input
                  value={translation.name}
                  onChange={(e) => handleTranslationChange(index, "name", e.target.value)}
                  placeholder="Attribute name in selected language"
                  required
                />
              </FormGroup>
            </TranslationCard>
          ))}

          <AddTranslationButton type="button" $variant="secondary" onClick={addTranslation}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add Translation
          </AddTranslationButton>
        </CardContent>
      </Card>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Button type="button" $variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Attribute" : "Create Attribute"}
        </Button>
      </div>
    </Form>
  );
};

export default AttributeForm;
