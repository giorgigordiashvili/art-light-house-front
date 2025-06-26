"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #2b3445;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: #7d879c;
  margin: 0;
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const ActionHeader = styled.div`
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

const Badge = styled.span<{ $variant: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.$variant) {
      case "default":
        return "#e8f5e8";
      case "active":
        return "#e8f5e8";
      case "inactive":
        return "#f5f5f5";
      default:
        return "#e5e5e5";
    }
  }};
  color: ${(props) => {
    switch (props.$variant) {
      case "default":
        return "#2d8f2d";
      case "active":
        return "#2d8f2d";
      case "inactive":
        return "#6c757d";
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
  max-width: 500px;
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

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

interface Language {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  _count?: {
    translations: number;
    attributeTypeTranslations: number;
    attributeTranslations: number;
    categoryTranslations: number;
  };
}

const LanguageManagement = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    isDefault: false,
    isActive: true,
  });

  const fetchLanguages = async () => {
    try {
      const response = await fetch("/api/admin/languages");
      if (!response.ok) throw new Error("Failed to fetch languages");
      const data = await response.json();
      setLanguages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchLanguages();
      setLoading(false);
    };

    loadData();
  }, []);

  const openModal = (language?: Language) => {
    if (language) {
      setEditingLanguage(language);
      setFormData({
        code: language.code,
        name: language.name,
        isDefault: language.isDefault,
        isActive: language.isActive,
      });
    } else {
      setEditingLanguage(null);
      setFormData({
        code: "",
        name: "",
        isDefault: false,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLanguage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const url = editingLanguage
        ? `/api/admin/languages/${editingLanguage.id}`
        : "/api/admin/languages";

      const method = editingLanguage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save language");
      }

      closeModal();
      fetchLanguages();
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this language?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/languages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete language");
      }

      fetchLanguages();
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const getTotalTranslations = (language: Language) => {
    if (!language._count) return 0;
    return (
      language._count.translations +
      language._count.attributeTypeTranslations +
      language._count.attributeTranslations +
      language._count.categoryTranslations
    );
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: "center", padding: "2rem", color: "#7d879c" }}>Loading...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div
          style={{
            background: "#fee",
            color: "#c33",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          Error: {error}
          <button
            onClick={fetchLanguages}
            style={{
              marginLeft: "1rem",
              padding: "0.5rem 1rem",
              background: "#c33",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Language Management</Title>
        <Subtitle>
          Manage the languages supported by your application. Set up translations for attributes,
          categories, and content.
        </Subtitle>
      </Header>

      <ContentArea>
        <ActionHeader>
          <div>
            <h3 style={{ margin: 0, color: "#2b3445" }}>Languages</h3>
            <p style={{ margin: "0.5rem 0 0 0", color: "#7d879c" }}>
              Configure available languages for your multilingual content
            </p>
          </div>
          <AddButton onClick={() => openModal()}>Add Language</AddButton>
        </ActionHeader>

        <Table>
          <thead>
            <tr>
              <Th>Language</Th>
              <Th>Code</Th>
              <Th>Status</Th>
              <Th>Translations</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {languages.map((language) => (
              <tr key={language.id}>
                <Td>
                  <strong>{language.name}</strong>
                  {language.isDefault && <Badge $variant="default">Default</Badge>}
                </Td>
                <Td>
                  <code
                    style={{
                      background: "#f8f9fa",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                    }}
                  >
                    {language.code}
                  </code>
                </Td>
                <Td>
                  <Badge $variant={language.isActive ? "active" : "inactive"}>
                    {language.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>{getTotalTranslations(language)} items</Td>
                <Td>
                  <ActionButton onClick={() => openModal(language)}>Edit</ActionButton>
                  <ActionButton
                    variant="danger"
                    onClick={() => handleDelete(language.id)}
                    disabled={language.isDefault || getTotalTranslations(language) > 0}
                  >
                    Delete
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        {languages.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#7d879c" }}>
            No languages found. Add your first language to get started.
          </div>
        )}
      </ContentArea>

      {showModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <ModalContent>
            <h3 style={{ margin: "0 0 1rem 0", color: "#2b3445" }}>
              {editingLanguage ? "Edit Language" : "Add Language"}
            </h3>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Language Code*</Label>
                <Input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., en, ka, de, fr"
                  pattern="[a-z]{2,3}"
                  maxLength={3}
                  required
                />
                <small style={{ color: "#7d879c" }}>
                  ISO 639-1 language code (2-3 lowercase letters)
                </small>
              </FormGroup>

              <FormGroup>
                <Label>Language Name*</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., English, ქართული, Deutsch"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))
                    }
                  />
                  Set as default language
                </label>
                <small style={{ color: "#7d879c" }}>
                  The default language will be used as fallback when translations are missing
                </small>
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

              <ButtonGroup>
                <ActionButton type="button" onClick={closeModal}>
                  Cancel
                </ActionButton>
                <AddButton type="submit" disabled={formLoading}>
                  {formLoading ? "Saving..." : editingLanguage ? "Update" : "Create"}
                </AddButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default LanguageManagement;
