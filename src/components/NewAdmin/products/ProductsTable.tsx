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

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
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

interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_price?: number;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  category?: {
    id: number;
    name: string;
  };
  images?: Array<{
    id: number;
    image_url: string;
    is_primary: boolean;
  }>;
  created_at: string;
}

interface ProductsTableProps {
  products: Product[];
  loading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
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
                    product.images?.find((img) => img.is_primary)?.image_url ||
                    "/assets/placeholder.png"
                  }
                  alt={product.title}
                />
                <div>
                  <div style={{ fontWeight: 500 }}>{product.title}</div>
                  <div style={{ fontSize: "0.875rem", color: "#6c757d" }}>SKU: {product.slug}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <PriceText>
                {formatPrice(product.price)}
                {product.compare_price && product.compare_price > product.price && (
                  <span className="compare-price">{formatPrice(product.compare_price)}</span>
                )}
              </PriceText>
            </TableCell>
            <TableCell>
              <StockBadge $inStock={product.stock_quantity > 0}>
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
              </StockBadge>
            </TableCell>
            <TableCell>{product.category ? product.category.name : "Uncategorized"}</TableCell>
            <TableCell>
              <StatusBadge $status={product.is_active ? "active" : "inactive"}>
                {product.is_active ? "Active" : "Inactive"}
              </StatusBadge>
            </TableCell>
            <TableCell>{formatDate(product.created_at)}</TableCell>
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
