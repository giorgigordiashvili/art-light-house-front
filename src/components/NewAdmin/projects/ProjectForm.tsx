"use client";
import { useState, useEffect } from "react";
import { ProjectDetail } from "@/api/generated/interfaces";
import {
  Form,
  FormGroup,
  FormRow,
  Label,
  Input,
  Textarea,
  CheckboxWrapper,
  Checkbox,
  CheckboxLabel,
  ErrorMessage,
  HelperText,
} from "@/components/NewAdmin/ui/Form";
import { Button } from "@/components/NewAdmin/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/NewAdmin/ui/Card";
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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4/3;

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
    width: 28px;
    height: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .primary-indicator {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(0, 123, 255, 0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

const ExistingImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

interface FormData {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  client: string;
  location: string;
  year: string;
  category: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order: string;
}

interface ProjectFormProps {
  initialData?: ProjectDetail | null;
  onSubmit: (data: FormData, images: File[]) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProjectForm = ({ initialData, onSubmit, onCancel, loading = false }: ProjectFormProps) => {
  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      return {
        title: initialData.title || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        short_description: initialData.short_description || "",
        client: initialData.client || "",
        location: initialData.location || "",
        year: initialData.year?.toString() || "",
        category: initialData.category || "",
        is_published: initialData.is_published ?? false,
        is_featured: initialData.is_featured ?? false,
        sort_order: initialData.sort_order?.toString() || "0",
      };
    }

    return {
      title: "",
      slug: "",
      description: "",
      short_description: "",
      client: "",
      location: "",
      year: "",
      category: "",
      is_published: false,
      is_featured: false,
      sort_order: "0",
    };
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug from title
    if (name === "title" && !initialData) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 100);
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).filter(
        (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024 // 10MB limit
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
            <Label>Project Title *</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? "error" : ""}
              placeholder="Enter project title"
              required
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Slug *</Label>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className={errors.slug ? "error" : ""}
              placeholder="project-url-slug"
              required
            />
            {errors.slug && <ErrorMessage>{errors.slug}</ErrorMessage>}
            <HelperText>URL-friendly version of the title (auto-generated)</HelperText>
          </FormGroup>

          <FormGroup>
            <Label>Short Description</Label>
            <Textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              placeholder="Brief description for project cards..."
              rows={3}
            />
            <HelperText>A brief summary shown in project listings</HelperText>
          </FormGroup>

          <FormGroup>
            <Label>Full Description *</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? "error" : ""}
              placeholder="Full project description (supports HTML)..."
              rows={10}
              required
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
            <HelperText>
              Supports HTML formatting. You can use tags like &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;,
              &lt;strong&gt;, etc.
            </HelperText>
          </FormGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Project Details</h2>
        </CardHeader>
        <CardContent>
          <FormRow>
            <FormGroup>
              <Label>Client</Label>
              <Input
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                placeholder="Client name"
              />
            </FormGroup>

            <FormGroup>
              <Label>Location</Label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Project location"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Year</Label>
              <Input
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="2024"
                min="1900"
                max="2100"
              />
            </FormGroup>

            <FormGroup>
              <Label>Category</Label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Residential, Commercial, Hospitality"
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Sort Order</Label>
            <Input
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={handleInputChange}
              placeholder="0"
            />
            <HelperText>Lower numbers appear first</HelperText>
          </FormGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2>Images</h2>
        </CardHeader>
        <CardContent>
          {initialData && initialData.images && initialData.images.length > 0 && (
            <>
              <Label>Existing Images</Label>
              <ExistingImagesGrid>
                {initialData.images.map((image) => (
                  <ImageCard key={image.id}>
                    <img src={image.image_url} alt={image.alt_text || "Project image"} />
                    {image.is_primary && <div className="primary-indicator">Primary</div>}
                  </ImageCard>
                ))}
              </ExistingImagesGrid>
              <HelperText style={{ marginBottom: "16px" }}>
                To manage existing images, use the Django admin or delete/reorder them there
              </HelperText>
            </>
          )}

          <Label>Upload New Images</Label>
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
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 8.58c0-2.5-3.97-3.58-6-3.58s-6 1.08-6 3.58V17h12v-1.42zM8.48 15c.74-.51 2.23-1 3.52-1s2.78.49 3.52 1H8.48z" />
            </svg>
            <p className="upload-text">
              Click to upload images or drag and drop
              <br />
              <small>PNG, JPG up to 10MB each. First image will be primary.</small>
            </p>
          </ImageUploadArea>

          {images.length > 0 && (
            <ImagePreview>
              {images.map((file, index) => (
                <ImageCard key={index}>
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
          <h2>Visibility & Status</h2>
        </CardHeader>
        <CardContent>
          <CheckboxWrapper>
            <Checkbox
              name="is_published"
              checked={formData.is_published}
              onChange={handleInputChange}
            />
            <CheckboxLabel>
              <strong>Published</strong> - Project is visible to the public
            </CheckboxLabel>
          </CheckboxWrapper>

          <CheckboxWrapper>
            <Checkbox
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
            />
            <CheckboxLabel>
              <strong>Featured</strong> - Highlight this project on the homepage
            </CheckboxLabel>
          </CheckboxWrapper>
        </CardContent>
      </Card>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Button type="button" $variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </Form>
  );
};

export default ProjectForm;
