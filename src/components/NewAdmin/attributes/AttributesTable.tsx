"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableActions,
  EmptyState,
  LoadingSpinner,
} from "@/components/NewAdmin/ui/Table";
import { Button } from "@/components/NewAdmin/ui/Button";
import styled from "styled-components";
import { AdminAttribute } from "@/api/generated/interfaces";

const TypeBadge = styled.span<{ $type: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.$type) {
      case "text":
        return "#e3f2fd";
      case "number":
        return "#f3e5f5";
      case "boolean":
        return "#e8f5e8";
      case "choice":
        return "#fff3e0";
      case "color":
        return "#fce4ec";
      case "size":
        return "#e1f5fe";
      default:
        return "#f5f5f5";
    }
  }};
  color: ${(props) => {
    switch (props.$type) {
      case "text":
        return "#0d47a1";
      case "number":
        return "#4a148c";
      case "boolean":
        return "#1b5e20";
      case "choice":
        return "#e65100";
      case "color":
        return "#880e4f";
      case "size":
        return "#01579b";
      default:
        return "#424242";
    }
  }};
`;

const ValuesPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 200px;

  .value-chip {
    padding: 2px 6px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #495057;
  }

  .more-indicator {
    color: #6c757d;
    font-size: 0.75rem;
  }
`;

const RequiredBadge = styled.span`
  background: #dc3545;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const OptionalBadge = styled.span`
  background: #6c757d;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

interface AttributesTableProps {
  attributes: AdminAttribute[];
  loading?: boolean;
  onEdit: (attribute: AdminAttribute) => void;
  onDelete: (attribute: AdminAttribute) => void;
  onManageValues: (attribute: AdminAttribute) => void;
  onReorder: (attributes: AdminAttribute[]) => void;
}

const AttributesTable = ({
  attributes,
  loading = false,
  onEdit,
  onDelete,
  onManageValues,
}: AttributesTableProps) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (attributes.length === 0) {
    return (
      <EmptyState>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        <h3>No attributes found</h3>
        <p>Start by creating your first product attribute.</p>
      </EmptyState>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderValues = (attribute: AdminAttribute) => {
    if (!attribute.values || attribute.values.length === 0) {
      return <span style={{ color: "#6c757d", fontSize: "0.875rem" }}>No values</span>;
    }

    const visibleValues = attribute.values.slice(0, 3);
    const remainingCount = attribute.values.length - 3;

    return (
      <ValuesPreview>
        {visibleValues.map((value) => (
          <span key={value.id} className="value-chip">
            {value.value}
          </span>
        ))}
        {remainingCount > 0 && <span className="more-indicator">+{remainingCount} more</span>}
      </ValuesPreview>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Attribute</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Values</TableHead>
          <TableHead>Required</TableHead>
          <TableHead>Filterable</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attributes.map((attribute) => (
          <TableRow key={attribute.id}>
            <TableCell>
              <div style={{ fontWeight: 500 }}>{attribute.name}</div>
            </TableCell>
            <TableCell>
              <TypeBadge $type={attribute.attribute_type as any}>
                {attribute.attribute_type as any}
              </TypeBadge>
            </TableCell>
            <TableCell>{renderValues(attribute)}</TableCell>
            <TableCell>
              {attribute.is_required ? (
                <RequiredBadge>Required</RequiredBadge>
              ) : (
                <OptionalBadge>Optional</OptionalBadge>
              )}
            </TableCell>
            <TableCell>
              {attribute.is_filterable ? (
                <span style={{ color: "#28a745" }}>✓</span>
              ) : (
                <span style={{ color: "#6c757d" }}>–</span>
              )}
            </TableCell>
            <TableCell>
              <span
                style={{
                  background: "#f8f9fa",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              >
                {attribute.id}
              </span>
            </TableCell>
            <TableCell>{formatDate(attribute.created_at)}</TableCell>
            <TableCell>
              <TableActions>
                <Button $variant="secondary" $size="sm" onClick={() => onEdit(attribute)}>
                  Edit
                </Button>
                {((attribute.attribute_type as any) === "choice" ||
                  (attribute.attribute_type as any) === "color" ||
                  (attribute.attribute_type as any) === "size") && (
                  <Button $variant="secondary" $size="sm" onClick={() => onManageValues(attribute)}>
                    Values
                  </Button>
                )}
                <Button $variant="danger" $size="sm" onClick={() => onDelete(attribute)}>
                  Delete
                </Button>
              </TableActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttributesTable;
