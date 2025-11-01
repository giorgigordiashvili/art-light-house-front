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
import { ProductList } from "@/api/generated/interfaces";
import styled from "styled-components";

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
`;

const StatusBadge = styled.span<{ $status: "active" | "inactive" }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => (props.$status === "active" ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.$status === "active" ? "#155724" : "#721c24")};
`;

const StockBadge = styled.span<{ $inStock: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => (props.$inStock ? "#d1ecf1" : "#f5c6cb")};
  color: ${(props) => (props.$inStock ? "#0c5460" : "#721c24")};
`;

const PriceText = styled.div`
  font-weight: 600;
  color: #212529;

  .compare-price {
    font-size: 0.875rem;
    color: #6c757d;
    text-decoration: line-through;
    margin-left: 8px;
  }
`;

interface ProductsTableProps {
  products: ProductList[];
  loading?: boolean;
  onEdit: (product: ProductList) => void;
  onDelete: (product: ProductList) => void;
  onToggleStatus: (product: ProductList) => void;
}

const ProductsTable = ({
  products,
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProductsTableProps) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return (
      <EmptyState>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.5-1.1 1.9c-.1.3-.1.6-.1.9 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25L7.7 13H19l1.8-3.5L20.8 2H5.21L4.27 0H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
        <h3>No products found</h3>
        <p>Start by adding your first product to the catalog.</p>
      </EmptyState>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ProductImage
                  src={
                    (typeof product.primary_image === "object" &&
                      product.primary_image !== null &&
                      "image" in product.primary_image &&
                      (product.primary_image as any).image) ||
                    (typeof product.primary_image === "string" && product.primary_image) ||
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-size='12' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E"
                  }
                  alt={
                    (typeof product.primary_image === "object" &&
                      product.primary_image !== null &&
                      "alt_text" in product.primary_image &&
                      (product.primary_image as any).alt_text) ||
                    product.title
                  }
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-size='12' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div>
                  <div style={{ fontWeight: 500 }}>{product.title}</div>
                  <div style={{ fontSize: "0.875rem", color: "#6c757d" }}>SKU: {product.slug}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <PriceText>
                ₾{product.price}
                {product.compare_price &&
                  parseFloat(product.compare_price) > parseFloat(product.price) && (
                    <span className="compare-price">₾{product.compare_price}</span>
                  )}
              </PriceText>
            </TableCell>
            <TableCell>
              <StockBadge $inStock={product.is_in_stock === "true"}>
                {product.stock_quantity
                  ? `${product.stock_quantity} in stock`
                  : product.is_in_stock === "true"
                    ? "In stock"
                    : "Out of stock"}
              </StockBadge>
            </TableCell>
            <TableCell>{product.category_name || "Uncategorized"}</TableCell>
            <TableCell>
              <StatusBadge $status={product.is_active ? "active" : "inactive"}>
                {product.is_active ? "Active" : "Inactive"}
              </StatusBadge>
            </TableCell>
            <TableCell>
              <TableActions>
                <Button $variant="secondary" $size="sm" onClick={() => onEdit(product)}>
                  Edit
                </Button>
                <Button
                  $variant={product.is_active ? "secondary" : "success"}
                  $size="sm"
                  onClick={() => onToggleStatus(product)}
                >
                  {product.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button $variant="danger" $size="sm" onClick={() => onDelete(product)}>
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

export default ProductsTable;
