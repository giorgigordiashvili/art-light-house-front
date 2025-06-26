"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const FormContainer = styled.form`
  max-width: 800px;
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
  align-items: center;
  gap: 0.5rem;
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
  width: 1.2rem;
  height: 1.2rem;
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
  margin-top: 2rem;
  padding-top: 2rem;
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

const TranslationSection = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f8f9fa;
`;

const TranslationHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TranslationTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #2b3445;
  margin: 0;
`;

const AddTranslationButton = styled.button`
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #bbdefb;
  }
`;

const TranslationItem = styled.div`
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RemoveTranslationButton = styled.button`
  background: #ffebee;
  color: #c62828;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #ffcdd2;
  }
`;

interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  displayName?: string;
  translations?: Array<{
    id: string;
    languageId: string;
    displayName: string;
    description?: string;
    language: {
      id: string;
      code: string;
      name: string;
    };
  }>;
}

interface Language {
  id: string;
  code: string;
  name: string;
}

interface Translation {
  languageId: string;
  displayName: string;
  description: string;
}

interface CategoryFormProps {
  category?: Category | null;
  categories: Category[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
    isActive: true,
    sortOrder: 0,
  });

  const [translations, setTranslations] = useState<Translation[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available languages
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/admin/languages");
        if (response.ok) {
          const data = await response.json();
          setLanguages(data);
        }
      } catch (err) {
        console.error("Error fetching languages:", err);
      }
    };

    fetchLanguages();

    // Populate form if editing
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        parentId: category.parentId || "",
        isActive: category.isActive,
        sortOrder: category.sortOrder,
      });

      if (category.translations) {
        setTranslations(
          category.translations.map((t) => ({
            languageId: t.languageId,
            displayName: t.displayName,
            description: t.description || "",
          }))
        );
      }
    }
  }, [category]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTranslation = () => {
    const availableLanguages = languages.filter(
      (lang) => !translations.some((t) => t.languageId === lang.id)
    );

    if (availableLanguages.length > 0) {
      setTranslations((prev) => [
        ...prev,
        {
          languageId: availableLanguages[0].id,
          displayName: "",
          description: "",
        },
      ]);
    }
  };

  const removeTranslation = (index: number) => {
    setTranslations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTranslation = (index: number, field: keyof Translation, value: string) => {
    setTranslations((prev) =>
      prev.map((translation, i) => (i === index ? { ...translation, [field]: value } : translation))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formData.name) {
        throw new Error("Category name is required");
      }

      // Filter out empty translations
      const validTranslations = translations.filter((t) => t.languageId && t.displayName);

      const submitData = {
        ...formData,
        sortOrder: parseInt(formData.sortOrder.toString()) || 0,
        translations: validTranslations.length > 0 ? validTranslations : undefined,
      };

      await onSubmit(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  // Get categories that can be parents (exclude self and descendants)
  const availableParents = categories.filter((cat) => {
    if (category && cat.id === category.id) return false;
    // TODO: Add logic to exclude descendants
    return true;
  });

  const getLanguageName = (languageId: string) => {
    const language = languages.find((lang) => lang.id === languageId);
    return language ? language.name : "Unknown";
  };

  const getAvailableLanguages = (currentLanguageId?: string) => {
    return languages.filter(
      (lang) => lang.id === currentLanguageId || !translations.some((t) => t.languageId === lang.id)
    );
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Basic Information */}
      <FormSection>
        <SectionTitle>Basic Information</SectionTitle>
        <FormRow>
          <FormGroup>
            <Label>Category Name *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter category name"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Parent Category</Label>
            <Select
              value={formData.parentId}
              onChange={(e) => handleInputChange("parentId", e.target.value)}
            >
              <option value="">No Parent (Root Category)</option>
              {availableParents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.displayName || parent.name}
                </option>
              ))}
            </Select>
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label>Description</Label>
          <TextArea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter category description"
          />
        </FormGroup>

        <FormRow>
          <FormGroup>
            <Label>Sort Order</Label>
            <Input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange("sortOrder", parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </FormGroup>
          <FormGroup>
            <CheckboxGroup>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                />
                Active
              </CheckboxLabel>
            </CheckboxGroup>
          </FormGroup>
        </FormRow>
      </FormSection>

      {/* Translations */}
      <FormSection>
        <TranslationSection>
          <TranslationHeader>
            <TranslationTitle>Translations</TranslationTitle>
            {languages.length > translations.length && (
              <AddTranslationButton type="button" onClick={addTranslation}>
                Add Translation
              </AddTranslationButton>
            )}
          </TranslationHeader>

          {translations.length > 0 ? (
            translations.map((translation, index) => (
              <TranslationItem key={index}>
                <FormRow>
                  <FormGroup>
                    <Label>Language</Label>
                    <Select
                      value={translation.languageId}
                      onChange={(e) => updateTranslation(index, "languageId", e.target.value)}
                    >
                      {getAvailableLanguages(translation.languageId).map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                  <FormGroup style={{ display: "flex", alignItems: "end" }}>
                    <RemoveTranslationButton type="button" onClick={() => removeTranslation(index)}>
                      Remove
                    </RemoveTranslationButton>
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label>Display Name</Label>
                  <Input
                    type="text"
                    value={translation.displayName}
                    onChange={(e) => updateTranslation(index, "displayName", e.target.value)}
                    placeholder={`Category name in ${getLanguageName(translation.languageId)}`}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    value={translation.description}
                    onChange={(e) => updateTranslation(index, "description", e.target.value)}
                    placeholder={`Category description in ${getLanguageName(translation.languageId)}`}
                  />
                </FormGroup>
              </TranslationItem>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#7d879c", padding: "1rem" }}>
              No translations added yet. Click &quot;Add Translation&quot; to add multilingual
              support.
            </div>
          )}
        </TranslationSection>
      </FormSection>

      <ButtonGroup>
        <Button type="button" $variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" $variant="primary" disabled={submitting}>
          {submitting ? "Saving..." : category ? "Update Category" : "Create Category"}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default CategoryForm;
