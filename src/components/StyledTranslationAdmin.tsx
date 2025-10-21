"use client";

import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { translationService } from "@/lib/translationService";
import { Language, Translation } from "@/types/translations";

// Styled Components
const Container = styled.div`
  width: 100%;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f5f9;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2b3445;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2b3445;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e0e5eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #2b3445;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e0e5eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2b3445;
  }
`;

const Button = styled.button<{ variant?: "primary" | "danger" | "secondary" }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) => {
    switch (props.variant) {
      case "primary":
        return `
          background-color: #2b3445;
          color: white;
          &:hover {
            background-color: #1e2531;
          }
        `;
      case "danger":
        return `
          background-color: #d23f57;
          color: white;
          &:hover {
            background-color: #b8334a;
          }
        `;
      default:
        return `
          background-color: #f3f5f9;
          color: #2b3445;
          &:hover {
            background-color: #e8ecf1;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #f3f5f9;
  font-weight: 600;
  color: #2b3445;
  font-size: 0.875rem;
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #f3f5f9;
  font-size: 0.875rem;
  vertical-align: top;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #fafafa;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ErrorMessage = styled.div`
  background-color: #ffe6e6;
  color: #d23f57;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: between;
  align-items: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #7d879c;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const LanguageCard = styled.div<{ isActive: boolean; isDefault: boolean }>`
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid
    ${(props) => (props.isDefault ? "#2b3445" : props.isActive ? "#e0e5eb" : "#f3f5f9")};
  background: ${(props) => (props.isDefault ? "#f8f9fa" : "white")};
  position: relative;
`;

const LanguageBadge = styled.span<{ type: "default" | "active" | "inactive" }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;

  ${(props) => {
    switch (props.type) {
      case "default":
        return `
          background-color: #2b3445;
          color: white;
        `;
      case "active":
        return `
          background-color: #4caf50;
          color: white;
        `;
      default:
        return `
          background-color: #f44336;
          color: white;
        `;
    }
  }}
`;

export default function TranslationAdmin() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedNamespace, setSelectedNamespace] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [newTranslation, setNewTranslation] = useState({
    key: "",
    value: "",
    namespace: "",
  });

  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [newLanguage, setNewLanguage] = useState({ name: "", code: "" });

  const loadLanguages = useCallback(async () => {
    try {
      const langs = await translationService.getLanguages();
      setLanguages(langs);
      if (langs.length > 0 && !selectedLanguage) {
        setSelectedLanguage(langs.find((l) => l.isDefault)?.id || langs[0].id);
      }
    } catch {
      setError("Failed to load languages");
    }
  }, [selectedLanguage]);

  const loadTranslations = useCallback(async () => {
    try {
      setLoading(true);
      const selectedLang = languages.find((l) => l.id === selectedLanguage);
      if (!selectedLang) return;

      const filters: any = { language: selectedLang.code };
      if (selectedNamespace) {
        filters.namespace = selectedNamespace;
      }

      const trans = await translationService.getTranslations(filters);
      setTranslations(trans);
    } catch {
      setError("Failed to load translations");
    } finally {
      setLoading(false);
    }
  }, [languages, selectedLanguage, selectedNamespace]);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  useEffect(() => {
    if (selectedLanguage) {
      loadTranslations();
    }
  }, [selectedLanguage, selectedNamespace, loadTranslations]);

  const handleCreateLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLanguage.name || !newLanguage.code) return;

    try {
      await translationService.createLanguage({
        ...newLanguage,
        isDefault: languages.length === 0,
        isActive: true,
      });

      setNewLanguage({ name: "", code: "" });
      loadLanguages();
    } catch {
      setError("Failed to create language");
    }
  };

  const handleCreateTranslation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTranslation.key || !newTranslation.value || !selectedLanguage) return;

    try {
      await translationService.createTranslation({
        ...newTranslation,
        languageId: selectedLanguage,
      });

      setNewTranslation({ key: "", value: "", namespace: "" });
      loadTranslations();
    } catch {
      setError("Failed to create translation");
    }
  };

  const handleUpdateTranslation = async (translation: Translation) => {
    if (!editingTranslation) return;

    try {
      await translationService.updateTranslation(translation.id, {
        key: editingTranslation.key,
        value: editingTranslation.value,
        namespace: editingTranslation.namespace,
      });

      setEditingTranslation(null);
      loadTranslations();
    } catch {
      setError("Failed to update translation");
    }
  };

  const handleDeleteTranslation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this translation?")) return;

    try {
      await translationService.deleteTranslation(id);
      loadTranslations();
    } catch {
      setError("Failed to delete translation");
    }
  };

  const toggleLanguageStatus = async (languageId: string) => {
    try {
      const language = languages.find((l) => l.id === languageId);
      if (!language) return;

      await translationService.updateLanguage(languageId, {
        ...language,
        isActive: !language.isActive,
      });

      loadLanguages();
    } catch {
      setError("Failed to update language status");
    }
  };

  const namespaces = Array.from(new Set(translations.map((t) => t.namespace).filter(Boolean)));

  return (
    <Container>
      {error && (
        <ErrorMessage>
          {error}
          <Button onClick={() => setError(null)}>×</Button>
        </ErrorMessage>
      )}

      {/* Language Management Section */}
      <SectionCard>
        <SectionTitle>🌐 Language Management</SectionTitle>

        <Form onSubmit={handleCreateLanguage}>
          <FormGroup>
            <Label>Language Name</Label>
            <Input
              type="text"
              placeholder="e.g., English"
              value={newLanguage.name}
              onChange={(e) => setNewLanguage((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Language Code</Label>
            <Input
              type="text"
              placeholder="e.g., en"
              value={newLanguage.code}
              onChange={(e) => setNewLanguage((prev) => ({ ...prev, code: e.target.value }))}
              required
            />
          </FormGroup>
          <div></div>
          <Button type="submit" variant="primary">
            Add Language
          </Button>
        </Form>

        <LanguageGrid>
          {languages.map((lang) => (
            <LanguageCard key={lang.id} isActive={lang.isActive} isDefault={lang.isDefault}>
              <div>
                <strong>{lang.name}</strong> ({lang.code})
                {lang.isDefault && <LanguageBadge type="default">Default</LanguageBadge>}
                {lang.isActive ? (
                  <LanguageBadge type="active">Active</LanguageBadge>
                ) : (
                  <LanguageBadge type="inactive">Inactive</LanguageBadge>
                )}
              </div>
              <ActionButtons style={{ marginTop: "0.5rem" }}>
                <Button
                  variant={lang.isActive ? "danger" : "primary"}
                  onClick={() => toggleLanguageStatus(lang.id)}
                  disabled={lang.isDefault}
                >
                  {lang.isActive ? "Deactivate" : "Activate"}
                </Button>
              </ActionButtons>
            </LanguageCard>
          ))}
        </LanguageGrid>
      </SectionCard>

      {/* Translation Management Section */}
      <SectionCard>
        <SectionTitle>📝 Translation Management</SectionTitle>

        <ControlsGrid>
          <FormGroup>
            <Label>Language</Label>
            <Select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value="">Select Language</option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name} ({lang.code})
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Namespace (optional)</Label>
            <Select
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
            >
              <option value="">All Namespaces</option>
              {namespaces.map((ns) => (
                <option key={ns} value={ns}>
                  {ns}
                </option>
              ))}
            </Select>
          </FormGroup>
        </ControlsGrid>

        {selectedLanguage && (
          <>
            <Form onSubmit={handleCreateTranslation}>
              <FormGroup>
                <Label>Translation Key</Label>
                <Input
                  type="text"
                  placeholder="e.g., welcome.title"
                  value={newTranslation.key}
                  onChange={(e) => setNewTranslation((prev) => ({ ...prev, key: e.target.value }))}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Translation Value</Label>
                <Input
                  type="text"
                  placeholder="e.g., Welcome to our site"
                  value={newTranslation.value}
                  onChange={(e) =>
                    setNewTranslation((prev) => ({ ...prev, value: e.target.value }))
                  }
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Namespace (optional)</Label>
                <Input
                  type="text"
                  placeholder="e.g., common"
                  value={newTranslation.namespace}
                  onChange={(e) =>
                    setNewTranslation((prev) => ({ ...prev, namespace: e.target.value }))
                  }
                />
              </FormGroup>
              <Button type="submit" variant="primary">
                Add Translation
              </Button>
            </Form>

            {loading ? (
              <LoadingSpinner>Loading translations...</LoadingSpinner>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Key</TableHeader>
                    <TableHeader>Value</TableHeader>
                    <TableHeader>Namespace</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {translations.map((translation) => (
                    <TableRow key={translation.id}>
                      <TableCell>
                        {editingTranslation?.id === translation.id ? (
                          <Input
                            value={editingTranslation.key}
                            onChange={(e) =>
                              setEditingTranslation((prev) =>
                                prev ? { ...prev, key: e.target.value } : null
                              )
                            }
                          />
                        ) : (
                          translation.key
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTranslation?.id === translation.id ? (
                          <Input
                            value={editingTranslation.value}
                            onChange={(e) =>
                              setEditingTranslation((prev) =>
                                prev ? { ...prev, value: e.target.value } : null
                              )
                            }
                          />
                        ) : (
                          translation.value
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTranslation?.id === translation.id ? (
                          <Input
                            value={editingTranslation.namespace || ""}
                            onChange={(e) =>
                              setEditingTranslation((prev) =>
                                prev ? { ...prev, namespace: e.target.value } : null
                              )
                            }
                          />
                        ) : (
                          translation.namespace || "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          {editingTranslation?.id === translation.id ? (
                            <>
                              <Button
                                variant="primary"
                                onClick={() => handleUpdateTranslation(translation)}
                              >
                                Save
                              </Button>
                              <Button onClick={() => setEditingTranslation(null)}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              <Button onClick={() => setEditingTranslation(translation)}>
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                onClick={() => handleDeleteTranslation(translation.id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}

            {translations.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "2rem", color: "#7d879c" }}>
                No translations found for the selected language and namespace.
              </div>
            )}
          </>
        )}
      </SectionCard>
    </Container>
  );
}
