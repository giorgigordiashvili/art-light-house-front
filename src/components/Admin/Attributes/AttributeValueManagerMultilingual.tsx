"use client";
import React, { useState, useEffect } from "react";
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

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
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
  border-bottom: 2px solid #e0e5eb;
  font-weight: 600;
  color: #2b3445;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e0e5eb;
  vertical-align: top;
`;

const Tr = styled.tr`
  &:hover {
    background: #fafafa;
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
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #2b3445;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #7d879c;
  cursor: pointer;

  &:hover {
    color: #2b3445;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2b3445;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e5eb;
  border-radius: 6px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e5eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }
`;

const Button = styled.button<{ variant?: "primary" | "danger" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) => {
    switch (props.variant) {
      case "primary":
        return `
          background: #2b3445;
          color: white;
          &:hover { background: #1e2633; }
        `;
      case "danger":
        return `
          background: #d23f57;
          color: white;
          &:hover { background: #b8334a; }
        `;
      default:
        return `
          background: #f3f5f9;
          color: #2b3445;
          &:hover { background: #e8ecf1; }
        `;
    }
  }}
`;

const ColorPreview = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${(props) => props.$color};
  border: 1px solid #e0e5eb;
  display: inline-block;
  margin-right: 0.5rem;
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => (props.$active ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.$active ? "#155724" : "#721c24")};
`;

const UsageCount = styled.span`
  padding: 0.25rem 0.5rem;
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const TranslationSection = styled.div`
  border: 1px solid #e0e5eb;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const TranslationHeader = styled.div`
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e5eb;
  font-weight: 500;
  color: #2b3445;
`;

const TranslationContent = styled.div`
  padding: 1rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Types
interface Language {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
}

interface AttributeType {
  id: string;
  name: string;
  inputType: string;
  isRequired: boolean;
  isActive: boolean;
  sortOrder: number;
  _count?: { productAttributes: number };
  translations: Array<{
    id: string;
    languageId: string;
    displayName: string;
    description?: string;
    language: Language;
  }>;
}

interface Attribute {
  id: string;
  attributeTypeId: string;
  value: string;
  hexColor?: string;
  sortOrder: number;
  isActive: boolean;
  _count?: { productAttributes: number };
  attributeType: AttributeType;
  translations: Array<{
    id: string;
    languageId: string;
    displayValue: string;
    language: Language;
  }>;
}

interface Props {
  onRefresh: () => void;
}

const AttributeValueManagerMultilingual: React.FC<Props> = ({ onRefresh }) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [filterAttributeType, setFilterAttributeType] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    attributeTypeId: "",
    value: "",
    hexColor: "",
    sortOrder: 0,
  });

  const [translations, setTranslations] = useState<{ [languageId: string]: string }>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attributesRes, attributeTypesRes, languagesRes] = await Promise.all([
        fetch("/api/admin/attributes"),
        fetch("/api/admin/attribute-types"),
        fetch("/api/admin/languages"),
      ]);

      if (!attributesRes.ok || !attributeTypesRes.ok || !languagesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [attributesData, attributeTypesData, languagesData] = await Promise.all([
        attributesRes.json(),
        attributeTypesRes.json(),
        languagesRes.json(),
      ]);

      setAttributes(attributesData);
      setAttributeTypes(attributeTypesData);
      setLanguages(languagesData.languages || languagesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (attribute?: Attribute) => {
    if (attribute) {
      setEditingAttribute(attribute);
      setFormData({
        attributeTypeId: attribute.attributeTypeId,
        value: attribute.value,
        hexColor: attribute.hexColor || "",
        sortOrder: attribute.sortOrder,
      });

      // Set translations
      const translationMap: { [languageId: string]: string } = {};
      attribute.translations.forEach((t) => {
        translationMap[t.languageId] = t.displayValue;
      });
      setTranslations(translationMap);
    } else {
      setEditingAttribute(null);
      setFormData({
        attributeTypeId: "",
        value: "",
        hexColor: "",
        sortOrder: 0,
      });
      setTranslations({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAttribute(null);
    setFormData({
      attributeTypeId: "",
      value: "",
      hexColor: "",
      sortOrder: 0,
    });
    setTranslations({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that we have at least one translation
    const translationEntries = Object.entries(translations).filter(([, value]) => value.trim());
    if (translationEntries.length === 0) {
      setError("At least one translation is required");
      return;
    }

    try {
      const body = {
        ...formData,
        translations: translationEntries.reduce(
          (acc, [languageId, displayValue]) => {
            acc[languageId] = { displayValue };
            return acc;
          },
          {} as { [languageId: string]: { displayValue: string } }
        ),
      };

      const url = editingAttribute
        ? `/api/admin/attributes/${editingAttribute.id}`
        : "/api/admin/attributes";

      const method = editingAttribute ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save attribute");
      }

      closeModal();
      fetchData();
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attribute value?")) return;

    try {
      const response = await fetch(`/api/admin/attributes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete attribute");
      }

      fetchData();
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const getAttributeTypeDisplayName = (attributeType: AttributeType, languageId: string) => {
    const translation = attributeType.translations.find((t) => t.languageId === languageId);
    return translation?.displayName || attributeType.name;
  };

  const getAttributeDisplayValue = (attribute: Attribute, languageId: string) => {
    const translation = attribute.translations.find((t) => t.languageId === languageId);
    return translation?.displayValue || attribute.value;
  };

  const filteredAttributes = filterAttributeType
    ? attributes.filter((attr) => attr.attributeTypeId === filterAttributeType)
    : attributes;

  const defaultLanguage = languages.find((l) => l.isDefault) || languages[0];

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading attribute values...</LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h2>Attribute Values</h2>
        <AddButton onClick={() => openModal()}>Add Attribute Value</AddButton>
      </Header>

      <FilterSection>
        <div>
          <Label>Filter by Attribute Type:</Label>
          <Select
            value={filterAttributeType}
            onChange={(e) => setFilterAttributeType(e.target.value)}
          >
            <option value="">All Attribute Types</option>
            {attributeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {defaultLanguage
                  ? getAttributeTypeDisplayName(type, defaultLanguage.id)
                  : type.name}
              </option>
            ))}
          </Select>
        </div>
      </FilterSection>

      {filteredAttributes.length === 0 ? (
        <EmptyState>
          <h3>No attribute values found</h3>
          <p>Start by creating your first attribute value.</p>
          <AddButton onClick={() => openModal()}>Add First Attribute Value</AddButton>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Attribute Type</Th>
              <Th>Value</Th>
              <Th>Display Value ({defaultLanguage?.name || "Default"})</Th>
              <Th>Color</Th>
              <Th>Sort Order</Th>
              <Th>Status</Th>
              <Th>Usage</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredAttributes.map((attribute) => (
              <Tr key={attribute.id}>
                <Td>
                  {defaultLanguage
                    ? getAttributeTypeDisplayName(attribute.attributeType, defaultLanguage.id)
                    : attribute.attributeType.name}
                </Td>
                <Td>
                  <code>{attribute.value}</code>
                </Td>
                <Td>
                  {defaultLanguage
                    ? getAttributeDisplayValue(attribute, defaultLanguage.id)
                    : attribute.value}
                </Td>
                <Td>
                  {attribute.hexColor && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ColorPreview $color={attribute.hexColor} />
                      {attribute.hexColor}
                    </div>
                  )}
                </Td>
                <Td>{attribute.sortOrder}</Td>
                <Td>
                  <StatusBadge $active={attribute.isActive}>
                    {attribute.isActive ? "Active" : "Inactive"}
                  </StatusBadge>
                </Td>
                <Td>
                  {attribute._count && (
                    <UsageCount>{attribute._count.productAttributes} products</UsageCount>
                  )}
                </Td>
                <Td>
                  <ButtonGroup>
                    <Button onClick={() => openModal(attribute)}>Edit</Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(attribute.id)}
                      disabled={(attribute._count?.productAttributes || 0) > 0}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      {isModalOpen && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingAttribute ? "Edit Attribute Value" : "Add Attribute Value"}
              </ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Attribute Type</Label>
                <Select
                  value={formData.attributeTypeId}
                  onChange={(e) => setFormData({ ...formData, attributeTypeId: e.target.value })}
                  required
                >
                  <option value="">Select attribute type</option>
                  {attributeTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {defaultLanguage
                        ? getAttributeTypeDisplayName(type, defaultLanguage.id)
                        : type.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Internal Value</Label>
                <Input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g., red, large, cotton"
                  required
                />
              </FormGroup>

              {formData.attributeTypeId &&
                attributeTypes.find((t) => t.id === formData.attributeTypeId)?.inputType ===
                  "color" && (
                  <FormGroup>
                    <Label>Hex Color</Label>
                    <Input
                      type="color"
                      value={formData.hexColor}
                      onChange={(e) => setFormData({ ...formData, hexColor: e.target.value })}
                    />
                  </FormGroup>
                )}

              <FormGroup>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                  }
                />
              </FormGroup>

              <div style={{ marginBottom: "1.5rem" }}>
                <Label>Translations</Label>
                {languages.map((language) => (
                  <TranslationSection key={language.id}>
                    <TranslationHeader>
                      {language.name} ({language.code}){language.isDefault && " (Default)"}
                    </TranslationHeader>
                    <TranslationContent>
                      <FormGroup>
                        <Label>Display Value</Label>
                        <Input
                          type="text"
                          value={translations[language.id] || ""}
                          onChange={(e) =>
                            setTranslations({
                              ...translations,
                              [language.id]: e.target.value,
                            })
                          }
                          placeholder={`Display value in ${language.name}`}
                          required={language.isDefault}
                        />
                      </FormGroup>
                    </TranslationContent>
                  </TranslationSection>
                ))}
              </div>

              <ButtonGroup>
                <Button type="submit" variant="primary">
                  {editingAttribute ? "Update" : "Create"}
                </Button>
                <Button type="button" onClick={closeModal}>
                  Cancel
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AttributeValueManagerMultilingual;
