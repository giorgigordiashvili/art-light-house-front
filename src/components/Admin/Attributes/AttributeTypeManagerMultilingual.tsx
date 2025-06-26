"use client";
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AddButton = styled.button`
  background: #2b3445;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #1e2633;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 600;
  color: #2b3445;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
`;

const Badge = styled.span<{ variant: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.variant) {
      case "active":
        return "#e8f5e8";
      case "inactive":
        return "#f5f5f5";
      case "required":
        return "#fff3cd";
      default:
        return "#e5e5e5";
    }
  }};
  color: ${(props) => {
    switch (props.variant) {
      case "active":
        return "#2d8f2d";
      case "inactive":
        return "#6c757d";
      case "required":
        return "#856404";
      default:
        return "#495057";
    }
  }};
`;

const ActionButton = styled.button<{ variant?: "danger" }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => (props.variant === "danger" ? "#dc3545" : "#6c757d")};
  background: ${(props) => (props.variant === "danger" ? "#dc3545" : "white")};
  color: ${(props) => (props.variant === "danger" ? "white" : "#6c757d")};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.variant === "danger" ? "#c82333" : "#f8f9fa")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2b3445;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const LanguageTabs = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;
  gap: 0.5rem;
`;

const LanguageTab = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1rem;
  background: ${(props) => (props.isActive ? "#2b3445" : "white")};
  color: ${(props) => (props.isActive ? "white" : "#7d879c")};
  border: 1px solid ${(props) => (props.isActive ? "#2b3445" : "#ddd")};
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: ${(props) => (props.isActive ? "600" : "400")};

  &:hover {
    background: ${(props) => (props.isActive ? "#2b3445" : "#f8f9fa")};
  }
`;

const TranslationSection = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 1.5rem;
  background: #fafafa;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #7d879c;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #7d879c;

  h3 {
    margin-bottom: 0.5rem;
    color: #2b3445;
  }

  p {
    margin-bottom: 1.5rem;
  }
`;

interface AttributeType {
  id: string;
  name: string;
  inputType: string;
  isRequired: boolean;
  isActive: boolean;
  sortOrder: number;
  translations: AttributeTypeTranslation[];
  _count?: { productAttributes: number };
}

interface AttributeTypeTranslation {
  id: string;
  languageId: string;
  displayName: string;
  description?: string;
  language: {
    id: string;
    code: string;
    name: string;
  };
}

interface Language {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
}

interface AttributeTypeManagerProps {
  onRefresh: () => void;
}

const AttributeTypeManagerMultilingual: React.FC<AttributeTypeManagerProps> = ({ onRefresh }) => {
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<AttributeType | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [activeLanguageTab, setActiveLanguageTab] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    inputType: "text",
    isRequired: false,
    isActive: true,
    sortOrder: 0,
  });
  const [translations, setTranslations] = useState<
    Record<string, { displayName: string; description: string }>
  >({});

  const inputTypes = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "select", label: "Select (Dropdown)" },
    { value: "color", label: "Color Picker" },
    { value: "boolean", label: "Boolean (Yes/No)" },
  ];

  const fetchData = useCallback(async () => {
    try {
      setDataLoading(true);
      setError(null);

      const [attributeTypesRes, languagesRes] = await Promise.all([
        fetch("/api/admin/attribute-types"),
        fetch("/api/admin/languages"),
      ]);

      if (!attributeTypesRes.ok || !languagesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [attributeTypesData, languagesData] = await Promise.all([
        attributeTypesRes.json(),
        languagesRes.json(),
      ]);

      setAttributeTypes(attributeTypesData);

      const activeLanguages = languagesData.filter((lang: Language) => lang.isActive);
      setLanguages(activeLanguages);

      // Set default language as active tab
      const defaultLang = activeLanguages.find((lang: Language) => lang.isDefault);
      if (defaultLang && !activeLanguageTab) {
        setActiveLanguageTab(defaultLang.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDataLoading(false);
    }
  }, [activeLanguageTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (type?: AttributeType) => {
    if (type) {
      setEditingType(type);
      setFormData({
        name: type.name,
        inputType: type.inputType,
        isRequired: type.isRequired,
        isActive: type.isActive,
        sortOrder: type.sortOrder,
      });

      // Set up translations
      const translationData: Record<string, { displayName: string; description: string }> = {};
      type.translations.forEach((trans) => {
        translationData[trans.languageId] = {
          displayName: trans.displayName,
          description: trans.description || "",
        };
      });

      // Fill empty translations for languages that don't have them
      languages.forEach((lang) => {
        if (!translationData[lang.id]) {
          translationData[lang.id] = { displayName: "", description: "" };
        }
      });

      setTranslations(translationData);
    } else {
      setEditingType(null);
      setFormData({
        name: "",
        inputType: "text",
        isRequired: false,
        isActive: true,
        sortOrder: 0,
      });

      // Initialize empty translations for all languages
      const emptyTranslations: Record<string, { displayName: string; description: string }> = {};
      languages.forEach((lang) => {
        emptyTranslations[lang.id] = { displayName: "", description: "" };
      });
      setTranslations(emptyTranslations);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingType
        ? `/api/admin/attribute-types/${editingType.id}`
        : "/api/admin/attribute-types";

      const method = editingType ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          translations,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save attribute type");
      }

      closeModal();
      await fetchData(); // Refresh local data
      onRefresh(); // Trigger parent refresh
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this attribute type?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/attribute-types/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete attribute type");
      }

      await fetchData(); // Refresh local data
      onRefresh(); // Trigger parent refresh
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const getDisplayName = (attributeType: AttributeType) => {
    // Get display name for default language or first available translation
    const defaultLang = languages.find((lang) => lang.isDefault);
    if (defaultLang) {
      const translation = attributeType.translations.find((t) => t.languageId === defaultLang.id);
      if (translation) return translation.displayName;
    }

    // Fallback to first available translation
    if (attributeType.translations.length > 0) {
      return attributeType.translations[0].displayName;
    }

    return attributeType.name;
  };

  const handleTranslationChange = (
    languageId: string,
    field: "displayName" | "description",
    value: string
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [languageId]: {
        ...prev[languageId],
        [field]: value,
      },
    }));
  };

  return (
    <Container>
      <Header>
        <div>
          <h3 style={{ margin: 0, color: "#2b3445" }}>Attribute Types</h3>
          <p style={{ margin: "0.5rem 0 0 0", color: "#7d879c" }}>
            Define the types of attributes that can be assigned to products
          </p>
        </div>
        <AddButton onClick={() => openModal()}>Add Attribute Type</AddButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {dataLoading ? (
        <LoadingSpinner>Loading attribute types...</LoadingSpinner>
      ) : attributeTypes.length === 0 ? (
        <EmptyState>
          <h3>No Attribute Types</h3>
          <p>Create your first attribute type to get started</p>
          <AddButton onClick={() => openModal()}>Add Attribute Type</AddButton>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Display Name</Th>
              <Th>Input Type</Th>
              <Th>Status</Th>
              <Th>Usage</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {attributeTypes.map((type) => (
              <tr key={type.id}>
                <Td>
                  <strong>{type.name}</strong>
                  {type.isRequired && <Badge variant="required">Required</Badge>}
                </Td>
                <Td>{getDisplayName(type)}</Td>
                <Td>
                  <Badge variant="default">
                    {inputTypes.find((t) => t.value === type.inputType)?.label || type.inputType}
                  </Badge>
                </Td>
                <Td>
                  <Badge variant={type.isActive ? "active" : "inactive"}>
                    {type.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>{type._count?.productAttributes || 0} products</Td>
                <Td>
                  <ActionButton onClick={() => openModal(type)}>Edit</ActionButton>
                  <ActionButton
                    variant="danger"
                    onClick={() => handleDelete(type.id)}
                    disabled={(type._count?.productAttributes || 0) > 0}
                  >
                    Delete
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {showModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <ModalContent>
            <h3 style={{ margin: "0 0 1rem 0", color: "#2b3445" }}>
              {editingType ? "Edit Attribute Type" : "Add Attribute Type"}
            </h3>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Name (Internal)*</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., color, size, material"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Input Type*</Label>
                <Select
                  value={formData.inputType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, inputType: e.target.value }))}
                  required
                >
                  {inputTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))
                  }
                  min="0"
                />
              </FormGroup>

              <FormGroup>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    type="checkbox"
                    checked={formData.isRequired}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isRequired: e.target.checked }))
                    }
                  />
                  Required for all products
                </label>
              </FormGroup>

              <FormGroup>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                  />
                  Active
                </label>
              </FormGroup>

              {languages.length > 0 && (
                <FormGroup>
                  <Label>Translations*</Label>

                  <LanguageTabs>
                    {languages.map((language) => (
                      <LanguageTab
                        key={language.id}
                        isActive={activeLanguageTab === language.id}
                        onClick={() => setActiveLanguageTab(language.id)}
                        type="button"
                      >
                        {language.name} ({language.code}){language.isDefault && " (Default)"}
                      </LanguageTab>
                    ))}
                  </LanguageTabs>

                  {activeLanguageTab && (
                    <TranslationSection>
                      <FormGroup>
                        <Label>Display Name*</Label>
                        <Input
                          type="text"
                          value={translations[activeLanguageTab]?.displayName || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              activeLanguageTab,
                              "displayName",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Color, Size, Material"
                          required
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Description</Label>
                        <Textarea
                          value={translations[activeLanguageTab]?.description || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              activeLanguageTab,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Optional description for this attribute type"
                        />
                      </FormGroup>
                    </TranslationSection>
                  )}
                </FormGroup>
              )}

              <ButtonGroup>
                <ActionButton type="button" onClick={closeModal}>
                  Cancel
                </ActionButton>
                <AddButton type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingType ? "Update" : "Create"}
                </AddButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AttributeTypeManagerMultilingual;
