"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const FormContent = styled.div`
  padding: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2b3445;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e5e5;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #2b3445;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }

  &::placeholder {
    color: #7d879c;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }

  &::placeholder {
    color: #7d879c;
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #2b3445;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const AttributeSection = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const AttributeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AttributeTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  color: #2b3445;
  margin: 0;
`;

const AddAttributeButton = styled.button`
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background: #bbdefb;
  }
`;

const AttributeItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

const RemoveButton = styled.button`
  background: #ffebee;
  color: #d32f2f;
  border: 1px solid #ffcdd2;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background: #ffcdd2;
  }
`;

const ColorInput = styled.input`
  padding: 0.4rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  width: 100px;
  height: 40px;
`;

const ImageSection = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 1rem;
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImageItem = styled.div`
  position: relative;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  overflow: hidden;
`;

const ImagePreviewImg = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const ImageControls = styled.div`
  padding: 0.5rem;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PrimaryBadge = styled.span`
  background: #4caf50;
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.7rem;
`;

const ImageInput = styled.input`
  padding: 0.8rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #d23f57;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #e5e5e5;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: #2b3445;
    color: white;
    
    &:hover {
      background: #1e2633;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `
      : `
    background: #f8f9fa;
    color: #2b3445;
    border: 1px solid #e5e5e5;
    
    &:hover {
      background: #e9ecef;
    }
  `}
`;

const LoadingState = styled.div`
  padding: 1rem;
  text-align: center;
  color: #7d879c;
`;

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  categoryId?: string;
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  category?: { id: string; name: string };
  productImages: Array<{
    id: string;
    imageUrl: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  productAttributes: Array<{
    id: string;
    attributeTypeId: string;
    attributeId?: string;
    customValue?: string;
    attributeType: {
      id: string;
      name: string;
      inputType: string;
    };
    attribute?: {
      id: string;
      value: string;
      hexColor?: string;
    };
  }>;
}

interface Category {
  id: string;
  name: string;
}

interface AttributeType {
  id: string;
  name: string;
  inputType: string;
  translations: Array<{
    languageId: string;
    displayName: string;
    language: { code: string; name: string };
  }>;
  attributes: Array<{
    id: string;
    value: string;
    hexColor?: string;
    translations: Array<{
      languageId: string;
      displayValue: string;
      language: { code: string; name: string };
    }>;
  }>;
}

interface ProductAttribute {
  attributeTypeId: string;
  attributeId?: string;
  customValue?: string;
}

interface ProductImage {
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    categoryId: "",
    isActive: true,
    isFeatured: false,
    stockQuantity: 0,
  });

  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories and attribute types
        const [categoriesRes, attributeTypesRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/attribute-types"),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (attributeTypesRes.ok) {
          const attributeTypesData = await attributeTypesRes.json();
          setAttributeTypes(attributeTypesData);
        }

        // If editing, populate form data
        if (product) {
          setFormData({
            name: product.name,
            description: product.description || "",
            price: product.price.toString(),
            sku: product.sku || "",
            categoryId: product.categoryId || "",
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            stockQuantity: product.stockQuantity,
          });

          setAttributes(
            product.productAttributes.map((attr) => ({
              attributeTypeId: attr.attributeTypeId,
              attributeId: attr.attributeId,
              customValue: attr.customValue,
            }))
          );

          setImages(
            product.productImages.map((img) => ({
              imageUrl: img.imageUrl,
              altText: img.altText,
              isPrimary: img.isPrimary,
              sortOrder: img.sortOrder,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load form data:", error);
        setError("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addAttribute = () => {
    setAttributes((prev) => [
      ...prev,
      {
        attributeTypeId: "",
        attributeId: "",
        customValue: "",
      },
    ]);
  };

  const updateAttribute = (index: number, field: keyof ProductAttribute, value: string) => {
    setAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    );
  };

  const removeAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const addImage = () => {
    setImages((prev) => [
      ...prev,
      {
        imageUrl: "",
        altText: "",
        isPrimary: prev.length === 0,
        sortOrder: prev.length,
      },
    ]);
  };

  const updateImage = (index: number, field: keyof ProductImage, value: any) => {
    setImages((prev) =>
      prev.map((img, i) => {
        if (i === index) {
          const updated = { ...img, [field]: value };
          // If setting as primary, unset others
          if (field === "isPrimary" && value) {
            return updated;
          }
          return updated;
        }
        // If another image is set as primary, unset this one
        if (field === "isPrimary" && value) {
          return { ...img, isPrimary: false };
        }
        return img;
      })
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      // If we removed the primary image, make the first one primary
      if (prev[index]?.isPrimary && filtered.length > 0) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const getDisplayName = (translations: any[], fallback: string) => {
    const englishTranslation = translations.find((t) => t.language.code === "en");
    return englishTranslation?.displayName || englishTranslation?.displayValue || fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formData.name || !formData.price) {
        throw new Error("Name and price are required");
      }

      // Filter out empty attributes
      const validAttributes = attributes.filter(
        (attr) => attr.attributeTypeId && (attr.attributeId || attr.customValue)
      );

      // Filter out empty images
      const validImages = images.filter((img) => img.imageUrl);

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        attributes: validAttributes,
        images: validImages,
      };

      await onSubmit(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <FormContainer>
        <FormContent>
          <LoadingState>Loading form data...</LoadingState>
        </FormContent>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormContent>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {/* Basic Information */}
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label>Product Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>SKU</Label>
                <Input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Enter product SKU"
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter product description"
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    handleInputChange("stockQuantity", parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange("categoryId", e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Status & Options</Label>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange("isActive", e.target.checked)}
                    />
                    Active
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                    />
                    Featured
                  </CheckboxLabel>
                </CheckboxGroup>
              </FormGroup>
            </FormRow>
          </FormSection>

          {/* Attributes */}
          <FormSection>
            <AttributeSection>
              <AttributeHeader>
                <AttributeTitle>Product Attributes</AttributeTitle>
                <AddAttributeButton type="button" onClick={addAttribute}>
                  Add Attribute
                </AddAttributeButton>
              </AttributeHeader>

              {attributes.map((attr, index) => {
                const selectedType = attributeTypes.find((t) => t.id === attr.attributeTypeId);

                return (
                  <AttributeItem key={index}>
                    <FormGroup>
                      <Label>Attribute Type</Label>
                      <Select
                        value={attr.attributeTypeId}
                        onChange={(e) => {
                          updateAttribute(index, "attributeTypeId", e.target.value);
                          // Reset values when type changes
                          updateAttribute(index, "attributeId", "");
                          updateAttribute(index, "customValue", "");
                        }}
                      >
                        <option value="">Select attribute type</option>
                        {attributeTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {getDisplayName(type.translations, type.name)}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Value</Label>
                      {selectedType?.inputType === "select" ? (
                        <Select
                          value={attr.attributeId || ""}
                          onChange={(e) => {
                            updateAttribute(index, "attributeId", e.target.value);
                            updateAttribute(index, "customValue", "");
                          }}
                        >
                          <option value="">Select value</option>
                          {selectedType.attributes.map((attrValue) => (
                            <option key={attrValue.id} value={attrValue.id}>
                              {getDisplayName(attrValue.translations, attrValue.value)}
                            </option>
                          ))}
                        </Select>
                      ) : selectedType?.inputType === "color" ? (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <ColorInput
                            type="color"
                            value={attr.customValue || "#000000"}
                            onChange={(e) => updateAttribute(index, "customValue", e.target.value)}
                          />
                          <Input
                            type="text"
                            value={attr.customValue || ""}
                            onChange={(e) => updateAttribute(index, "customValue", e.target.value)}
                            placeholder="#000000"
                          />
                        </div>
                      ) : (
                        <Input
                          type={selectedType?.inputType === "number" ? "number" : "text"}
                          value={attr.customValue || ""}
                          onChange={(e) => updateAttribute(index, "customValue", e.target.value)}
                          placeholder="Enter value"
                        />
                      )}
                    </FormGroup>

                    <RemoveButton type="button" onClick={() => removeAttribute(index)}>
                      Remove
                    </RemoveButton>
                  </AttributeItem>
                );
              })}

              {attributes.length === 0 && (
                <div style={{ textAlign: "center", color: "#7d879c", padding: "2rem" }}>
                  No attributes added. Click &quot;Add Attribute&quot; to start.
                </div>
              )}
            </AttributeSection>
          </FormSection>

          {/* Images */}
          <FormSection>
            <ImageSection>
              <AttributeHeader>
                <AttributeTitle>Product Images</AttributeTitle>
                <AddAttributeButton type="button" onClick={addImage}>
                  Add Image
                </AddAttributeButton>
              </AttributeHeader>

              {images.map((img, index) => (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  <FormRow>
                    <FormGroup>
                      <Label>Image URL</Label>
                      <ImageInput
                        type="url"
                        value={img.imageUrl}
                        onChange={(e) => updateImage(index, "imageUrl", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Alt Text</Label>
                      <Input
                        type="text"
                        value={img.altText || ""}
                        onChange={(e) => updateImage(index, "altText", e.target.value)}
                        placeholder="Describe the image"
                      />
                    </FormGroup>
                  </FormRow>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <CheckboxLabel>
                      <Checkbox
                        type="checkbox"
                        checked={img.isPrimary}
                        onChange={(e) => updateImage(index, "isPrimary", e.target.checked)}
                      />
                      Primary Image
                    </CheckboxLabel>
                    <RemoveButton type="button" onClick={() => removeImage(index)}>
                      Remove Image
                    </RemoveButton>
                  </div>
                </div>
              ))}

              {images.length > 0 && (
                <ImagePreview>
                  {images.map((img, index) => (
                    <ImageItem key={index}>
                      {img.imageUrl && (
                        <ImagePreviewImg
                          src={img.imageUrl}
                          alt={img.altText || "Product image"}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/emptyImage.svg";
                          }}
                        />
                      )}
                      <ImageControls>
                        {img.isPrimary && <PrimaryBadge>Primary</PrimaryBadge>}
                        <span style={{ fontSize: "0.8rem", color: "#7d879c" }}>
                          Image {index + 1}
                        </span>
                      </ImageControls>
                    </ImageItem>
                  ))}
                </ImagePreview>
              )}

              {images.length === 0 && (
                <div style={{ textAlign: "center", color: "#7d879c", padding: "2rem" }}>
                  No images added. Click &quot;Add Image&quot; to start.
                </div>
              )}
            </ImageSection>
          </FormSection>
        </FormContent>

        <ButtonGroup>
          <Button type="button" $variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" $variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : product ? "Update Product" : "Create Product"}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default ProductForm;
