"use client";
import React from "react";
import styled from "styled-components";

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2b3445;
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e5e5;

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: background-color 0.2s;

  &:hover {
    background: #f8f9fa;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #2b3445;
  font-size: 0.9rem;

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const CategoryName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const CategoryDescription = styled.div`
  color: #7d879c;
  font-size: 0.8rem;
`;

const ParentCategory = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  ${(props) =>
    props.$isActive
      ? `
    background: #e8f5e8;
    color: #2e7d2e;
  `
      : `
    background: #ffebee;
    color: #c62828;
  `}
`;

const ProductCount = styled.span`
  background: #f5f5f5;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant?: "edit" | "delete" }>`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s;

  ${(props) =>
    props.$variant === "delete"
      ? `
    background: #ffebee;
    color: #c62828;
    
    &:hover {
      background: #ffcdd2;
    }
  `
      : `
    background: #e3f2fd;
    color: #1976d2;
    
    &:hover {
      background: #bbdefb;
    }
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #7d879c;
`;

const SortOrder = styled.span`
  background: #f5f5f5;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  created_at: string;
  updated_at: string;
  displayName?: string;
  parent?: {
    id: string;
    name: string;
    displayName?: string;
  };
  children?: Category[];
  _count?: {
    products: number;
  };
}

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
  if (categories.length === 0) {
    return (
      <TableContainer>
        <EmptyState>No categories found. Create your first category to get started.</EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Parent</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Products</TableHeaderCell>
            <TableHeaderCell>Sort Order</TableHeaderCell>
            <TableHeaderCell>Created</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <CategoryName>{category.displayName || category.name}</CategoryName>
                {category.description && (
                  <CategoryDescription>{category.description}</CategoryDescription>
                )}
              </TableCell>
              <TableCell>
                {category.parent ? (
                  <ParentCategory>
                    {category.parent.displayName || category.parent.name}
                  </ParentCategory>
                ) : (
                  <span style={{ color: "#7d879c", fontSize: "0.8rem" }}>Root Category</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge $isActive={category.isActive}>
                  {category.isActive ? "Active" : "Inactive"}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <ProductCount>{category._count?.products || 0} products</ProductCount>
              </TableCell>
              <TableCell>
                <SortOrder>{category.sortOrder}</SortOrder>
              </TableCell>
              <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <ActionButtons>
                  <ActionButton
                    $variant="edit"
                    onClick={() => onEdit(category)}
                    title="Edit category"
                  >
                    Edit
                  </ActionButton>
                  <ActionButton
                    $variant="delete"
                    onClick={() => onDelete(category.id)}
                    title="Delete category"
                  >
                    Delete
                  </ActionButton>
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTable;
