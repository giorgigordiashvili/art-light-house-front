"use client";

import { useState, useEffect, useCallback } from "react";
import { translationService } from "@/lib/translationService";
import { Language, Translation } from "@/types/translations";

export function TranslationAdmin() {
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

  // Load languages on component mount
  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  // Load translations when language or namespace changes
  useEffect(() => {
    if (selectedLanguage) {
      loadTranslations();
    }
  }, [selectedLanguage, selectedNamespace, loadTranslations]);

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

  const namespaces = Array.from(new Set(translations.map((t) => t.namespace).filter(Boolean)));

  return (
    <div className="translation-admin">
      <h1>Translation Management</h1>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="controls">
        <div className="control-group">
          <label>Language:</label>
          <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
            <option value="">Select Language</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name} ({lang.code})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Namespace:</label>
          <select value={selectedNamespace} onChange={(e) => setSelectedNamespace(e.target.value)}>
            <option value="">All Namespaces</option>
            {namespaces.map((ns) => (
              <option key={ns} value={ns}>
                {ns}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add new translation form */}
      <form onSubmit={handleCreateTranslation} className="add-translation-form">
        <h3>Add New Translation</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Key"
            value={newTranslation.key}
            onChange={(e) => setNewTranslation({ ...newTranslation, key: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Value"
            value={newTranslation.value}
            onChange={(e) => setNewTranslation({ ...newTranslation, value: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Namespace (optional)"
            value={newTranslation.namespace}
            onChange={(e) => setNewTranslation({ ...newTranslation, namespace: e.target.value })}
          />
          <button type="submit">Add</button>
        </div>
      </form>

      {/* Translations list */}
      <div className="translations-list">
        <h3>Translations ({translations.length})</h3>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="translations-table">
            <div className="table-header">
              <div>Key</div>
              <div>Value</div>
              <div>Namespace</div>
              <div>Actions</div>
            </div>

            {translations.map((translation) => (
              <div key={translation.id} className="table-row">
                {editingTranslation?.id === translation.id ? (
                  <>
                    <input
                      value={editingTranslation.key}
                      onChange={(e) =>
                        setEditingTranslation({ ...editingTranslation, key: e.target.value })
                      }
                    />
                    <input
                      value={editingTranslation.value}
                      onChange={(e) =>
                        setEditingTranslation({ ...editingTranslation, value: e.target.value })
                      }
                    />
                    <input
                      value={editingTranslation.namespace || ""}
                      onChange={(e) =>
                        setEditingTranslation({ ...editingTranslation, namespace: e.target.value })
                      }
                    />
                    <div className="actions">
                      <button onClick={() => handleUpdateTranslation(translation)}>Save</button>
                      <button onClick={() => setEditingTranslation(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>{translation.key}</div>
                    <div>{translation.value}</div>
                    <div>{translation.namespace || "-"}</div>
                    <div className="actions">
                      <button onClick={() => setEditingTranslation(translation)}>Edit</button>
                      <button onClick={() => handleDeleteTranslation(translation.id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .translation-admin {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .controls {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .control-group label {
          font-weight: bold;
        }

        .control-group select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .add-translation-form {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .form-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .form-row input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .form-row button {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .translations-table {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns: 2fr 3fr 1fr 150px;
          gap: 10px;
          padding: 12px;
          align-items: center;
        }

        .table-header {
          background: #f5f5f5;
          font-weight: bold;
          border-bottom: 1px solid #ddd;
        }

        .table-row {
          border-bottom: 1px solid #eee;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row input {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 3px;
        }

        .actions {
          display: flex;
          gap: 5px;
        }

        .actions button {
          padding: 4px 8px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
        }

        .actions button:hover {
          background: #f5f5f5;
        }
      `}</style>
    </div>
  );
}
