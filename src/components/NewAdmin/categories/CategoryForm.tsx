"use client";
import { useState } from "react";
import { AdminCategory } from "@/api/generated/interfaces";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Textarea,
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
  description: string;
  parent_id: string;
  is_active: boolean;
  meta_title: string;
  meta_description: string;
  slug: string;
}

interface CategoryFormProps {
  initialData?: AdminCategory | null;
  categories: AdminCategory[];
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  loading?: boolean;
  parentId?: number;
}

const CategoryForm = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  loading = false,
  parentId,
}: CategoryFormProps) => {
  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        description: initialData.description || "",
        parent_id: initialData.parent?.toString() || "",
        is_active: initialData.is_active ?? true,
        meta_title: "",
        meta_description: "",
        slug: initialData.slug || "",
      };
    }

    return {
      name: "",
      description: "",
      parent_id: parentId?.toString() || "",
      is_active: true,
      meta_title: "",
      meta_description: "",
      slug: "",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (formData.parent_id && initialData && formData.parent_id === initialData.id?.toString()) {
      newErrors.parent_id = "Category cannot be its own parent";
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug from name
    if (name === "name" && !initialData) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50);
      setFormData((prev) => ({ ...prev, slug }));
    }

    // Auto-generate meta title from name
    if (name === "name" && !initialData) {
      setFormData((prev) => ({ ...prev, meta_title: value }));
    }
  };

  // Filter out the current category and its children from parent options
  const availableParents = categories.filter((cat) => {
    if (initialData) {
      // Don't allow selecting self or descendants as parent
      return cat.id.toString() !== initialData.id?.toString();
    }
    return true;
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <h2>Basic Information</h2>
        </CardHeader>
        <CardContent>
          <FormGroup>
            <Label>Category Name *</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "error" : ""}
              placeholder="Enter category name"
              required
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this category..."
              rows={4}
            />
          </FormGroup>

          <FormGroup>
            <Label>Slug</Label>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="category-url-slug"
            />
            <HelperText>
              URL-friendly version of the name. Will be auto-generated if left empty.
            </HelperText>
          </FormGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Hierarchy</h2>
        </CardHeader>
        <CardContent>
          <FormGroup>
            <Label>Parent Category</Label>
            <Select
              name="parent_id"
              value={formData.parent_id}
              onChange={handleInputChange}
              className={errors.parent_id ? "error" : ""}
            >
              <option value="">None (Root Category)</option>
              {availableParents.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.full_path || category.name}
                </option>
              ))}
            </Select>
            {errors.parent_id && <ErrorMessage>{errors.parent_id}</ErrorMessage>}
            <HelperText>
              Select a parent category to create a subcategory. Leave empty for root level.
            </HelperText>
          </FormGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>SEO Settings</h2>
        </CardHeader>
        <CardContent>
          <FormGroup>
            <Label>Meta Title</Label>
            <Input
              name="meta_title"
              value={formData.meta_title}
              onChange={handleInputChange}
              placeholder="SEO title for search engines"
            />
          </FormGroup>

          <FormGroup>
            <Label>Meta Description</Label>
            <Textarea
              name="meta_description"
              value={formData.meta_description}
              onChange={handleInputChange}
              placeholder="SEO description for search engines"
              rows={3}
            />
          </FormGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Visibility</h2>
        </CardHeader>
        <CardContent>
          <CheckboxWrapper>
            <Checkbox name="is_active" checked={formData.is_active} onChange={handleInputChange} />
            <CheckboxLabel>Category is active and visible to customers</CheckboxLabel>
          </CheckboxWrapper>
        </CardContent>
      </Card>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Button type="button" $variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </Form>
  );
};

export default CategoryForm;
