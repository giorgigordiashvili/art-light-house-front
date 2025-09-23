"use client";
import { useState, Fragment } from "react";
import { Input } from "@/components/admin/ui/Form";
import { Button, ButtonGroup } from "@/components/admin/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/admin/ui/Card";
import styled from "styled-components";

const ValuesContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ValueItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-bottom: 8px;
  background: white;

  &:hover {
    background: #f8f9fa;
  }

  .drag-handle {
    cursor: grab;
    color: #6c757d;

    &:active {
      cursor: grabbing;
    }
  }

  .value-display {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;

    .value-text {
      font-weight: 500;
    }

    .color-preview {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid #dee2e6;
    }
  }

  .value-actions {
    display: flex;
    gap: 8px;
  }
`;

const AddValueForm = styled.div`
  display: flex;
  gap: 12px;
  align-items: end;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;

  .form-group {
    flex: 1;
  }

  .color-input {
    width: 60px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: #6c757d;

  h4 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
`;

interface AttributeValue {
  id: number;
  value: string;
  color_code?: string;
  display_order: number;
}

interface Attribute {
  id: number;
  name: string;
  type: "text" | "number" | "boolean" | "choice" | "color" | "size";
  values?: AttributeValue[];
}

interface AttributeValuesManagerProps {
  attribute: Attribute;
  onSave: (values: AttributeValue[]) => void;
  onCancel: () => void;
  loading?: boolean;
}

const AttributeValuesManager = ({
  attribute,
  onSave,
  onCancel,
  loading = false,
}: AttributeValuesManagerProps) => {
  const [values, setValues] = useState<AttributeValue[]>(attribute.values || []);
  const [newValue, setNewValue] = useState("");
  const [newColorCode, setNewColorCode] = useState("#000000");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editColorCode, setEditColorCode] = useState("#000000");

  const handleAddValue = () => {
    if (!newValue.trim()) return;

    const newId = Math.max(0, ...values.map((v) => v.id)) + 1;
    const newValueObj: AttributeValue = {
      id: newId,
      value: newValue.trim(),
      display_order: values.length,
    };

    if (attribute.type === "color") {
      newValueObj.color_code = newColorCode;
    }

    setValues((prev) => [...prev, newValueObj]);
    setNewValue("");
    setNewColorCode("#000000");
  };

  const handleEditValue = (valueItem: AttributeValue) => {
    setEditingId(valueItem.id);
    setEditValue(valueItem.value);
    setEditColorCode(valueItem.color_code || "#000000");
  };

  const handleSaveEdit = () => {
    if (!editValue.trim() || editingId === null) return;

    setValues((prev) =>
      prev.map((v) =>
        v.id === editingId
          ? {
              ...v,
              value: editValue.trim(),
              ...(attribute.type === "color" ? { color_code: editColorCode } : {}),
            }
          : v
      )
    );

    setEditingId(null);
    setEditValue("");
    setEditColorCode("#000000");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setEditColorCode("#000000");
  };

  const handleDeleteValue = (id: number) => {
    if (confirm("Are you sure you want to delete this value?")) {
      setValues((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleSubmit = () => {
    onSave(values);
  };

  const renderValueDisplay = (valueItem: AttributeValue) => {
    if (attribute.type === "color") {
      return (
        <div className="value-display">
          <div
            className="color-preview"
            style={{ backgroundColor: valueItem.color_code || "#000000" }}
          />
          <span className="value-text">{valueItem.value}</span>
          {valueItem.color_code && (
            <span style={{ fontSize: "0.875rem", color: "#6c757d" }}>({valueItem.color_code})</span>
          )}
        </div>
      );
    }

    return (
      <div className="value-display">
        <span className="value-text">{valueItem.value}</span>
      </div>
    );
  };

  const renderEditForm = () => {
    return (
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: 1 }}>
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder="Value"
          style={{ flex: 1 }}
        />
        {attribute.type === "color" && (
          <Input
            type="color"
            value={editColorCode}
            onChange={(e) => setEditColorCode(e.target.value)}
            style={{ width: "60px" }}
          />
        )}
        <ButtonGroup>
          <Button $size="sm" onClick={handleSaveEdit}>
            Save
          </Button>
          <Button $size="sm" $variant="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </ButtonGroup>
      </div>
    );
  };

  const getPlaceholderText = () => {
    switch (attribute.type) {
      case "color":
        return "Color name (e.g., Red, Blue, Green)";
      case "size":
        return "Size (e.g., XS, S, M, L, XL)";
      case "choice":
        return "Option value";
      default:
        return "Value";
    }
  };

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <h2>Manage Values for &quot;{attribute.name}&quot;</h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "#6c757d" }}>
            Type: {attribute.type} • Add and organize the available values for this attribute
          </p>
        </CardHeader>
        <CardContent>
          <AddValueForm>
            <div className="form-group">
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={getPlaceholderText()}
                onKeyPress={(e) => e.key === "Enter" && handleAddValue()}
              />
            </div>
            {attribute.type === "color" && (
              <Input
                type="color"
                value={newColorCode}
                onChange={(e) => setNewColorCode(e.target.value)}
                className="color-input"
              />
            )}
            <Button onClick={handleAddValue} disabled={!newValue.trim()}>
              Add Value
            </Button>
          </AddValueForm>

          <ValuesContainer>
            {values.length === 0 ? (
              <EmptyState>
                <h4>No values added yet</h4>
                <p>Add some values using the form above</p>
              </EmptyState>
            ) : (
              values
                .sort((a, b) => a.display_order - b.display_order)
                .map((valueItem) => (
                  <ValueItem key={valueItem.id}>
                    <div className="drag-handle">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </div>

                    {editingId === valueItem.id ? (
                      renderEditForm()
                    ) : (
                      <>
                        {renderValueDisplay(valueItem)}
                        <div className="value-actions">
                          <Button
                            $size="sm"
                            $variant="secondary"
                            onClick={() => handleEditValue(valueItem)}
                          >
                            Edit
                          </Button>
                          <Button
                            $size="sm"
                            $variant="danger"
                            onClick={() => handleDeleteValue(valueItem.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </ValueItem>
                ))
            )}
          </ValuesContainer>
        </CardContent>
      </Card>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
        <Button $variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Values"}
        </Button>
      </div>
    </Fragment>
  );
};

export default AttributeValuesManager;
