"use client";
import { useState } from "react";
import {
  Form,
  FormGroup,
  FormRow,
  Label,
  Input,
  Textarea,
  Select,
  CheckboxWrapper,
  Checkbox,
  CheckboxLabel,
  ErrorMessage,
} from "@/components/Admin/ui/Form";
import { Button } from "@/components/Admin/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/Admin/ui/Card";
import styled from "styled-components";

const ImageUploadArea = styled.div`
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #007bff;
  }

  &.dragover {
    border-color: #007bff;
    background: #f8f9ff;
  }

  input[type="file"] {
    display: none;
  }

  .upload-text {
    margin: 0;
    color: #6c757d;
  }

  .upload-icon {
    margin-bottom: 16px;
    color: #dee2e6;
  }
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(220, 53, 69, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .primary-indicator {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(0, 123, 255, 0.9);
    color: white;
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 0.75rem;
  }
`;

interface FormData {
  title: string;
  description: string;
  price: string;
  compare_price: string;
  stock_quantity: string;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  track_inventory: boolean;
  allow_backorder: boolean;
  meta_title: string;
  meta_description: string;
  sku: string;
  barcode: string;
}

interface Category {
  id: number;
  name: string;
}

interface ProductFormProps {
  initialData?: Partial<FormData>;
  categories: Category[];
  onSubmit: (data: FormData, images: File[]) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProductForm = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    compare_price: "",
    stock_quantity: "0",
    category_id: "",
    is_active: true,
    is_featured: false,
    track_inventory: true,
    allow_backorder: false,
    meta_title: "",
    meta_description: "",
    sku: "",
    barcode: "",
    ...initialData,
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (
      formData.compare_price &&
      parseFloat(formData.compare_price) <= parseFloat(formData.price)
    ) {
      newErrors.compare_price = "Compare price must be higher than regular price";
    }

    if (
      formData.track_inventory &&
      (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0)
    ) {
      newErrors.stock_quantity = "Valid stock quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, images);
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

    // Auto-generate SKU from title
    if (name === "title" && !initialData) {
      const sku = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50);
      setFormData((prev) => ({ ...prev, sku }));
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).filter(
        (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024 // 5MB limit
      );
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <h2>Basic Information</h2>
        </CardHeader>
        <CardContent>
          <FormGroup>
            <Label>Product Title *</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? "error" : ""}
              placeholder="Enter product title"
              required
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Description *</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? "error" : ""}
              placeholder="Describe your product..."
              rows={5}
              required
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label>SKU</Label>
              <Input
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Product SKU"
              />
            </FormGroup>

            <FormGroup>
              <Label>Barcode</Label>
              <Input
                name="barcode"
                value={formData.barcode}
                onChange={handleInputChange}
                placeholder="Product barcode"
              />
            </FormGroup>
          </FormRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Pricing & Inventory</h2>
        </CardHeader>
        <CardContent>
          <FormRow>
            <FormGroup>
              <Label>Price *</Label>
              <Input
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className={errors.price ? "error" : ""}
                placeholder="0.00"
                required
              />
              {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Compare Price</Label>
              <Input
                name="compare_price"
                type="number"
                step="0.01"
                value={formData.compare_price}
                onChange={handleInputChange}
                className={errors.compare_price ? "error" : ""}
                placeholder="0.00"
              />
              {errors.compare_price && <ErrorMessage>{errors.compare_price}</ErrorMessage>}
            </FormGroup>
          </FormRow>

          <CheckboxWrapper>
            <Checkbox
              name="track_inventory"
              checked={formData.track_inventory}
              onChange={handleInputChange}
            />
            <CheckboxLabel>Track inventory for this product</CheckboxLabel>
          </CheckboxWrapper>

          {formData.track_inventory && (
            <FormRow>
              <FormGroup>
                <Label>Stock Quantity</Label>
                <Input
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  className={errors.stock_quantity ? "error" : ""}
                  placeholder="0"
                />
                {errors.stock_quantity && <ErrorMessage>{errors.stock_quantity}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <CheckboxWrapper style={{ marginTop: "32px" }}>
                  <Checkbox
                    name="allow_backorder"
                    checked={formData.allow_backorder}
                    onChange={handleInputChange}
                  />
                  <CheckboxLabel>Allow backorders when out of stock</CheckboxLabel>
                </CheckboxWrapper>
              </FormGroup>
            </FormRow>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Organization</h2>
        </CardHeader>
        <CardContent>
          <FormGroup>
            <Label>Category</Label>
            <Select name="category_id" value={formData.category_id} onChange={handleInputChange}>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <CheckboxWrapper>
            <Checkbox
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
            />
            <CheckboxLabel>Feature this product</CheckboxLabel>
          </CheckboxWrapper>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Images</h2>
        </CardHeader>
        <CardContent>
          <ImageUploadArea onClick={() => document.getElementById("image-upload")?.click()}>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <svg
              className="upload-icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            <p className="upload-text">
              Click to upload images or drag and drop
              <br />
              <small>PNG, JPG up to 5MB each</small>
            </p>
          </ImageUploadArea>

          {images.length > 0 && (
            <ImagePreview>
              {images.map((file, index) => (
                <ImageCard key={index}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                  <button type="button" className="remove-btn" onClick={() => removeImage(index)}>
                    ×
                  </button>
                  {index === 0 && <div className="primary-indicator">Primary</div>}
                </ImageCard>
              ))}
            </ImagePreview>
          )}
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
            <CheckboxLabel>Product is active and visible to customers</CheckboxLabel>
          </CheckboxWrapper>
        </CardContent>
      </Card>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Button type="button" $variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;
