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
import { AdminCategory } from "@/api/generated/interfaces";

const CategoryHierarchy = styled.div`
  display: flex;
  align-items: center;

  .category-name {
    font-weight: 500;
  }

  .category-path {
    font-size: 0.875rem;
    color: #6c757d;
    margin-top: 2px;
  }
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => (props.$isActive ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.$isActive ? "#155724" : "#721c24")};
`;

const ProductCountBadge = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

interface CategoriesTableProps {
  categories: AdminCategory[];
  loading?: boolean;
  onEdit: (category: AdminCategory) => void;
  onDelete: (category: AdminCategory) => void;
  onToggleStatus: (category: AdminCategory) => void;
  onAddChild: (category: AdminCategory) => void;
}

const CategoriesTable = ({
  categories,
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onAddChild,
}: CategoriesTableProps) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (categories.length === 0) {
    return (
      <EmptyState>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <h3>No categories found</h3>
        <p>Start by creating your first product category.</p>
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

  // API categories are already flat, no need to flatten

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              <CategoryHierarchy>
                <div>
                  <div className="category-name">{category.name}</div>
                  {category.full_path && <div className="category-path">{category.full_path}</div>}
                </div>
              </CategoryHierarchy>
            </TableCell>
            <TableCell>
              <ProductCountBadge>
                {category.subcategories_count
                  ? `${category.subcategories_count} subcategories`
                  : "No subcategories"}
              </ProductCountBadge>
            </TableCell>
            <TableCell>
              <StatusBadge $isActive={category.is_active ?? false}>
                {category.is_active ? "Active" : "Inactive"}
              </StatusBadge>
            </TableCell>
            <TableCell>{formatDate(category.created_at)}</TableCell>
            <TableCell>
              <TableActions>
                <Button $variant="secondary" $size="sm" onClick={() => onEdit(category)}>
                  Edit
                </Button>
                <Button $variant="secondary" $size="sm" onClick={() => onAddChild(category)}>
                  Add Child
                </Button>
                <Button
                  $variant={category.is_active ? "secondary" : "success"}
                  $size="sm"
                  onClick={() => onToggleStatus(category)}
                >
                  {category.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  $variant="danger"
                  $size="sm"
                  onClick={() => onDelete(category)}
                  disabled={
                    !!(category.subcategories_count && parseInt(category.subcategories_count) > 0)
                  }
                >
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

export default CategoriesTable;
