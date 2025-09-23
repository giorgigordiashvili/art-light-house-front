"use client";
import { useState } from "react";
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
} from "@/components/Admin/ui/Form";
import { Button } from "@/components/Admin/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/Admin/ui/Card";

interface FormData {
  name: string;
  type: "text" | "number" | "boolean" | "choice" | "color" | "size";
  is_required: boolean;
  is_filterable: boolean;
  display_order: string;
  description: string;
}

interface AttributeFormProps {
  initialData?: Partial<FormData>;
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
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "text",
    is_required: false,
    is_filterable: true,
    display_order: "0",
    description: "",
    ...initialData,
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

    if (!formData.type) {
      newErrors.type = "Attribute type is required";
    }

    if (formData.display_order && parseInt(formData.display_order) < 0) {
      newErrors.display_order = "Display order cannot be negative";
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

  const supportsValues = ["choice", "color", "size"].includes(formData.type);

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
            <Label>Description</Label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of this attribute"
            />
          </FormGroup>

          <FormGroup>
            <Label>Attribute Type *</Label>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={errors.type ? "error" : ""}
              required
            >
              {attributeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
            <HelperText>{getTypeDescription(formData.type)}</HelperText>
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
            <Label>Display Order</Label>
            <Input
              name="display_order"
              type="number"
              value={formData.display_order}
              onChange={handleInputChange}
              className={errors.display_order ? "error" : ""}
              placeholder="0"
              min="0"
            />
            {errors.display_order && <ErrorMessage>{errors.display_order}</ErrorMessage>}
            <HelperText>
              Order in which this attribute appears in forms and filters (0 = first)
            </HelperText>
          </FormGroup>

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
