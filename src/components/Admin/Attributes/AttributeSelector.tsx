"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AttributeGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2b3445;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RequiredBadge = styled.span`
  background: #fff3cd;
  color: #856404;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
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

const ColorPreview = styled.div<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  border: 1px solid #ddd;
  margin-left: 0.5rem;
`;

const ColorInputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
`;

interface AttributeType {
  id: string;
  name: string;
  displayName: string;
  inputType: string;
  isRequired: boolean;
  isActive: boolean;
  attributes: Attribute[];
}

interface Attribute {
  id: string;
  value: string;
  displayValue: string;
  hexColor?: string;
  isActive: boolean;
}

interface AttributeValue {
  attributeTypeId: string;
  attributeId?: string;
  customValue?: string;
}

interface AttributeSelectorProps {
  categoryId?: string;
  selectedAttributes: AttributeValue[];
  onChange: (attributes: AttributeValue[]) => void;
  errors?: Record<string, string>;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  selectedAttributes,
  onChange,
  errors = {},
}) => {
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttributeTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/attribute-types");
        if (response.ok) {
          const data = await response.json();
          setAttributeTypes(data.filter((type: AttributeType) => type.isActive));
        }
      } catch (error) {
        console.error("Error fetching attribute types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributeTypes();
  }, []);

  const handleAttributeChange = (
    attributeTypeId: string,
    value: string | null,
    isCustom: boolean = false
  ) => {
    const updatedAttributes = selectedAttributes.filter(
      (attr) => attr.attributeTypeId !== attributeTypeId
    );

    if (value) {
      updatedAttributes.push({
        attributeTypeId,
        ...(isCustom ? { customValue: value } : { attributeId: value }),
      });
    }

    onChange(updatedAttributes);
  };

  const getSelectedValue = (attributeTypeId: string) => {
    const selected = selectedAttributes.find((attr) => attr.attributeTypeId === attributeTypeId);
    return selected?.attributeId || selected?.customValue || "";
  };

  const getSelectedColor = (attributeTypeId: string) => {
    const selected = selectedAttributes.find((attr) => attr.attributeTypeId === attributeTypeId);
    if (selected?.attributeId) {
      const attributeType = attributeTypes.find((type) => type.id === attributeTypeId);
      const attribute = attributeType?.attributes.find((attr) => attr.id === selected.attributeId);
      return attribute?.hexColor;
    }
    return selected?.customValue;
  };

  if (loading) {
    return <div>Loading attributes...</div>;
  }

  return (
    <Container>
      {attributeTypes.map((attributeType) => (
        <AttributeGroup key={attributeType.id}>
          <Label>
            {attributeType.displayName}
            {attributeType.isRequired && <RequiredBadge>Required</RequiredBadge>}
          </Label>

          {attributeType.inputType === "text" && (
            <Input
              type="text"
              value={getSelectedValue(attributeType.id)}
              onChange={(e) =>
                handleAttributeChange(attributeType.id, e.target.value || null, true)
              }
              placeholder={`Enter ${attributeType.displayName.toLowerCase()}`}
            />
          )}

          {attributeType.inputType === "number" && (
            <Input
              type="number"
              value={getSelectedValue(attributeType.id)}
              onChange={(e) =>
                handleAttributeChange(attributeType.id, e.target.value || null, true)
              }
              placeholder={`Enter ${attributeType.displayName.toLowerCase()}`}
            />
          )}

          {attributeType.inputType === "select" && (
            <Select
              value={getSelectedValue(attributeType.id)}
              onChange={(e) => handleAttributeChange(attributeType.id, e.target.value || null)}
            >
              <option value="">Select {attributeType.displayName}</option>
              {attributeType.attributes
                .filter((attr) => attr.isActive)
                .map((attribute) => (
                  <option key={attribute.id} value={attribute.id}>
                    {attribute.displayValue}
                  </option>
                ))}
            </Select>
          )}

          {attributeType.inputType === "color" && (
            <div>
              <Select
                value={getSelectedValue(attributeType.id)}
                onChange={(e) => handleAttributeChange(attributeType.id, e.target.value || null)}
              >
                <option value="">Select {attributeType.displayName}</option>
                {attributeType.attributes
                  .filter((attr) => attr.isActive)
                  .map((attribute) => (
                    <option key={attribute.id} value={attribute.id}>
                      {attribute.displayValue}
                    </option>
                  ))}
              </Select>

              {getSelectedColor(attributeType.id) && (
                <ColorInputContainer>
                  <span>Preview:</span>
                  <ColorPreview color={getSelectedColor(attributeType.id)!} />
                </ColorInputContainer>
              )}
            </div>
          )}

          {attributeType.inputType === "boolean" && (
            <Select
              value={getSelectedValue(attributeType.id)}
              onChange={(e) =>
                handleAttributeChange(attributeType.id, e.target.value || null, true)
              }
            >
              <option value="">Select {attributeType.displayName}</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
          )}

          {errors[attributeType.id] && <ErrorText>{errors[attributeType.id]}</ErrorText>}
        </AttributeGroup>
      ))}

      {attributeTypes.length === 0 && (
        <div style={{ color: "#7d879c", textAlign: "center", padding: "2rem" }}>
          No attribute types are currently available. Create some attribute types in the admin panel
          first.
        </div>
      )}
    </Container>
  );
};

export default AttributeSelector;
