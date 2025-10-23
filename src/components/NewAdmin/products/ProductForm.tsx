"use client";
import { useState, useEffect } from "react";
import { ProductDetail, AdminAttribute, AdminAttributeValue } from "@/api/generated/interfaces";
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
  HelperText,
} from "@/components/NewAdmin/ui/Form";
import { Button } from "@/components/NewAdmin/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/NewAdmin/ui/Card";
import styled from "styled-components";
import adminAxios from "@/api/admin-axios";

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

const AddButton = styled(Button)`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AttributeCard = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  margin-bottom: 16px;
`;

const AttributeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const AttributeTitle = styled.h4`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
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

interface ProductTranslation {
  language_code: string;
  title: string;
  description: string;
}

interface ProductAttribute {
  attribute: number;
  value: string;
  attribute_value?: number;
}

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
  translations: ProductTranslation[];
  attributes: ProductAttribute[];
}

interface Category {
  id: number;
  name: string;
}

interface ProductFormProps {
  initialData?: ProductDetail | null;
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
  const [formData, setFormData] = useState<FormData>(() => {
    // Convert ProductDetail to FormData format
    if (initialData) {
      return {
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || "",
        compare_price: initialData.compare_price || "",
        stock_quantity: initialData.stock_quantity?.toString() || "0",
        category_id: initialData.category?.toString() || "",
        is_active: initialData.is_active ?? true,
        is_featured: initialData.is_featured ?? false,
        track_inventory: initialData.track_inventory ?? true,
        allow_backorder: initialData.allow_backorder ?? false,
        meta_title: initialData.meta_title || "",
        meta_description: initialData.meta_description || "",
        sku: initialData.sku || "",
        barcode: initialData.barcode || "",
        translations: [],
        attributes: [],
      };
    }

    return {
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
      translations: [],
      attributes: [],
    };
  });

  const [attributes, setAttributes] = useState<AdminAttribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<AdminAttributeValue[]>([]);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string>("");

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || "",
        compare_price: initialData.compare_price || "",
        stock_quantity: initialData.stock_quantity?.toString() || "0",
        category_id: initialData.category?.toString() || "",
        is_active: initialData.is_active ?? true,
        is_featured: initialData.is_featured ?? false,
        track_inventory: initialData.track_inventory ?? true,
        allow_backorder: initialData.allow_backorder ?? false,
        meta_title: initialData.meta_title || "",
        meta_description: initialData.meta_description || "",
        sku: initialData.sku || "",
        barcode: initialData.barcode || "",
        translations: [],
        attributes: [],
      });
    } else {
      // Reset form for new product
      setFormData({
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
        translations: [],
        attributes: [],
      });
    }
  }, [initialData]);

  // Fetch attributes on component mount
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await adminAxios.get("/api/products/admin/attributes/");
        setAttributes(response.data.results || response.data || []);
      } catch {
        // Silently handle error
      }
    };

    fetchAttributes();
  }, []);

  // Fetch attribute values when selected attribute changes
  useEffect(() => {
    if (!selectedAttributeId) {
      setAttributeValues([]);
      return;
    }

    const fetchAttributeValues = async () => {
      try {
        const response = await adminAxios.get(
          `/api/products/admin/attributes/${selectedAttributeId}/values/`
        );
        setAttributeValues(response.data.results || response.data || []);
      } catch {
        // Silently handle error
        setAttributeValues([]);
      }
    };

    fetchAttributeValues();
  }, [selectedAttributeId]);

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

  // Product Attributes handlers
  const addAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { attribute: 0, value: "", attribute_value: undefined }],
    }));
  };

  const removeAttribute = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const handleAttributeChange = (index: number, field: keyof ProductAttribute, value: any) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => {
        if (i === index) {
          // When attribute is changed, reset attribute_value
          if (field === "attribute") {
            return { ...attr, [field]: value, attribute_value: undefined };
          }
          return { ...attr, [field]: value };
        }
        return attr;
      }),
    }));
  };

  // Translations handlers
  const addTranslation = () => {
    setFormData((prev) => ({
      ...prev,
      translations: [...prev.translations, { language_code: "en", title: "", description: "" }],
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
    field: keyof ProductTranslation,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((trans, i) =>
        i === index ? { ...trans, [field]: value } : trans
      ),
    }));
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
          <h2>Product Attributes</h2>
        </CardHeader>
        <CardContent>
          {formData.attributes.map((attr, index) => (
            <AttributeCard key={index}>
              <AttributeHeader>
                <AttributeTitle>Attribute {index + 1}</AttributeTitle>
                <RemoveButton type="button" onClick={() => removeAttribute(index)}>
                  ×
                </RemoveButton>
              </AttributeHeader>

              <FormGroup>
                <Label>Attribute</Label>
                <Select
                  value={attr.attribute || ""}
                  onChange={(e) => {
                    const attributeId = e.target.value;
                    handleAttributeChange(index, "attribute", Number(attributeId));
                    setSelectedAttributeId(attributeId);
                  }}
                >
                  <option value="">Select an attribute</option>
                  {attributes.map((attribute) => (
                    <option key={attribute.id} value={attribute.id}>
                      {attribute.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              {attr.attribute > 0 && (
                <FormGroup>
                  <Label>Attribute Value</Label>
                  <Select
                    value={attr.attribute_value || ""}
                    onChange={(e) =>
                      handleAttributeChange(
                        index,
                        "attribute_value",
                        Number(e.target.value) || undefined
                      )
                    }
                  >
                    <option value="">Select a value (optional)</option>
                    {attributeValues
                      .filter((av) => {
                        const selectedAttr = attributes.find((a) => a.id === attr.attribute);
                        return selectedAttr?.values?.some((v) => v.id === av.id);
                      })
                      .map((value) => (
                        <option key={value.id} value={value.id}>
                          {value.value}
                        </option>
                      ))}
                  </Select>
                  <HelperText>Or enter custom value below</HelperText>
                </FormGroup>
              )}

              <FormGroup>
                <Label>Custom Value</Label>
                <Input
                  type="text"
                  value={attr.value}
                  onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                  placeholder="Enter custom attribute value"
                />
              </FormGroup>
            </AttributeCard>
          ))}

          <AddButton type="button" onClick={addAttribute}>
            + Add Attribute
          </AddButton>
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
          <h2>Translations</h2>
        </CardHeader>
        <CardContent>
          {formData.translations.map((translation, index) => (
            <TranslationCard key={index}>
              <TranslationHeader>
                <TranslationTitle>Translation {index + 1}</TranslationTitle>
                <RemoveButton type="button" onClick={() => removeTranslation(index)}>
                  ×
                </RemoveButton>
              </TranslationHeader>

              <FormGroup>
                <Label>Language</Label>
                <Select
                  value={translation.language_code}
                  onChange={(e) => handleTranslationChange(index, "language_code", e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="ka">Georgian</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={translation.title}
                  onChange={(e) => handleTranslationChange(index, "title", e.target.value)}
                  placeholder="Product title in selected language"
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <Textarea
                  value={translation.description}
                  onChange={(e) => handleTranslationChange(index, "description", e.target.value)}
                  placeholder="Product description in selected language"
                  rows={4}
                />
              </FormGroup>
            </TranslationCard>
          ))}

          <AddButton type="button" onClick={addTranslation}>
            + Add Translation
          </AddButton>
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
