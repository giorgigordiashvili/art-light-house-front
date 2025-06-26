"use client";
import React from "react";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 600;
  color: #2b3445;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
`;

const ProductName = styled.div`
  font-weight: 500;
  color: #2b3445;
  margin-bottom: 0.25rem;
`;

const ProductSku = styled.div`
  font-size: 0.8rem;
  color: #7d879c;
`;

const Price = styled.div`
  font-weight: 600;
  color: #2b3445;
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => (props.$active ? "#e8f5e8" : "#fee")};
  color: ${(props) => (props.$active ? "#2e7d2e" : "#d23f57")};
`;

const FeaturedBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #fff3cd;
  color: #856404;
  margin-left: 0.5rem;
`;

const StockQuantity = styled.div<{ $lowStock: boolean }>`
  font-weight: 500;
  color: ${(props) => (props.$lowStock ? "#d23f57" : "#2b3445")};
`;

const AttributeTag = styled.span`
  display: inline-block;
  padding: 0.2rem 0.4rem;
  margin: 0.1rem;
  background: #f8f9fa;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  font-size: 0.75rem;
  color: #2b3445;
`;

const AttributeContainer = styled.div`
  max-width: 200px;
  overflow: hidden;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant?: "edit" | "delete" }>`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  ${(props) =>
    props.$variant === "edit"
      ? `
    background: #e3f2fd;
    color: #1976d2;
    
    &:hover {
      background: #bbdefb;
    }
  `
      : `
    background: #ffebee;
    color: #d32f2f;
    
    &:hover {
      background: #ffcdd2;
    }
  `}
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e5e5e5;
`;

const PaginationInfo = styled.div`
  color: #7d879c;
  font-size: 0.9rem;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #e5e5e5;
  background: ${(props) => (props.$active ? "#2b3445" : "white")};
  color: ${(props) => (props.$active ? "white" : "#2b3445")};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$active ? "#1e2633" : "#f8f9fa")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #7d879c;
`;

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  categoryId?: string;
  isActive: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  };
  productImages: Array<{
    id: string;
    imageUrl: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  productAttributes: Array<{
    id: string;
    attributeTypeId: string;
    attributeId?: string;
    customValue?: string;
    attributeType: {
      id: string;
      name: string;
      inputType: string;
      translations: Array<{
        languageId: string;
        displayName: string;
        language: {
          code: string;
          name: string;
        };
      }>;
    };
    attribute?: {
      id: string;
      value: string;
      hexColor?: string;
      translations: Array<{
        languageId: string;
        displayValue: string;
        language: {
          code: string;
          name: string;
        };
      }>;
    };
  }>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProductTableProps {
  products: Product[];
  pagination: Pagination;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  const getDisplayName = (translations: any[], fallback: string) => {
    const englishTranslation = translations.find((t) => t.language.code === "en");
    return englishTranslation?.displayName || englishTranslation?.displayValue || fallback;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getPrimaryImage = (images: Product["productImages"]) => {
    const primary = images.find((img) => img.isPrimary);
    return primary?.imageUrl || images[0]?.imageUrl || "/assets/emptyImage.svg";
  };

  const renderPagination = () => {
    const { page, pages } = pagination;
    const buttons = [];

    // Previous button
    buttons.push(
      <PageButton key="prev" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Previous
      </PageButton>
    );

    // Page number buttons
    for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) {
      buttons.push(
        <PageButton key={i} $active={i === page} onClick={() => onPageChange(i)}>
          {i}
        </PageButton>
      );
    }

    // Next button
    buttons.push(
      <PageButton key="next" onClick={() => onPageChange(page + 1)} disabled={page >= pages}>
        Next
      </PageButton>
    );

    return buttons;
  };

  if (products.length === 0) {
    return (
      <EmptyState>
        <h3>No products found</h3>
        <p>Start by adding your first product to the catalog.</p>
      </EmptyState>
    );
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            <Th>Product</Th>
            <Th>Price</Th>
            <Th>Stock</Th>
            <Th>Status</Th>
            <Th>Category</Th>
            <Th>Attributes</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <Td>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <ProductImage
                    src={getPrimaryImage(product.productImages)}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/emptyImage.svg";
                    }}
                  />
                  <div>
                    <ProductName>{product.name}</ProductName>
                    {product.sku && <ProductSku>SKU: {product.sku}</ProductSku>}
                  </div>
                </div>
              </Td>
              <Td>
                <Price>{formatPrice(product.price)}</Price>
              </Td>
              <Td>
                <StockQuantity $lowStock={product.stockQuantity < 10}>
                  {product.stockQuantity}
                </StockQuantity>
              </Td>
              <Td>
                <StatusBadge $active={product.isActive}>
                  {product.isActive ? "Active" : "Inactive"}
                </StatusBadge>
                {product.isFeatured && <FeaturedBadge>Featured</FeaturedBadge>}
              </Td>
              <Td>{product.category?.name || "No Category"}</Td>
              <Td>
                <AttributeContainer>
                  {product.productAttributes.map((attr) => (
                    <AttributeTag key={attr.id}>
                      {getDisplayName(attr.attributeType.translations, attr.attributeType.name)}:{" "}
                      {attr.attribute
                        ? getDisplayName(attr.attribute.translations, attr.attribute.value)
                        : attr.customValue}
                    </AttributeTag>
                  ))}
                </AttributeContainer>
              </Td>
              <Td>
                <Actions>
                  <ActionButton $variant="edit" onClick={() => onEdit(product)}>
                    Edit
                  </ActionButton>
                  <ActionButton $variant="delete" onClick={() => onDelete(product.id)}>
                    Delete
                  </ActionButton>
                </Actions>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PaginationContainer>
        <PaginationInfo>
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{" "}
          products
        </PaginationInfo>
        <PaginationButtons>{renderPagination()}</PaginationButtons>
      </PaginationContainer>
    </>
  );
};

export default ProductTable;
