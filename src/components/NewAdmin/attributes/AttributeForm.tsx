"use client";
import { useState } from "react";
import { AdminAttribute } from "@/api/generated/interfaces";
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

interface FormData {
  name: string;
  attribute_type: "text" | "number" | "boolean" | "choice" | "color" | "size";
  is_required: boolean;
  is_filterable: boolean;
  parent?: number;
  categories: number[];
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
  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        attribute_type: (initialData.attribute_type as any) || "text",
        is_required: initialData.is_required ?? false,
        is_filterable: initialData.is_filterable ?? true,
        parent: initialData.parent || undefined,
        categories: initialData.categories || [],
      };
    }

    return {
      name: "",
      attribute_type: "text",
      is_required: false,
      is_filterable: true,
      categories: [],
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const attributeTypes = [
    { value: "text", label: "Text", description: "Free text input" },
    { value: "number", label: "Number", description: "Numeric values" },
    { value: "boolean", label: "Boolean", description: "Yes/No or True/False" },
    { value: "choice", label: "Choice", description: "Select from predefined options" },
    { value: "color", label: "Color", description: "Color picker or color values" },
    { value: "size", label: "Size", description: "Size options (XS, S, M, L, XL, etc.)" },
  ];

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
