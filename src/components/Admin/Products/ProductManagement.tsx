"use client";
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import ProductFilters from "./ProductFilters";

const Container = styled.div`
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #2b3445;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #7d879c;
  margin: 0.5rem 0 0 0;
`;

const AddButton = styled.button`
  background: #2b3445;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #1e2633;
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const LoadingState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #7d879c;
`;

const ErrorState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #d23f57;
  background: #fee;
  border-radius: 4px;
  margin: 1rem 0;
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

interface Filters {
  search: string;
  categoryId: string;
  isActive: string;
  isFeatured: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    search: "",
    categoryId: "",
    isActive: "",
    isFeatured: "",
  });

  const buildQueryString = useCallback(
    (page: number = 1) => {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", pagination.limit.toString());

      if (filters.search) params.set("search", filters.search);
      if (filters.categoryId) params.set("categoryId", filters.categoryId);
      if (filters.isActive) params.set("isActive", filters.isActive);
      if (filters.isFeatured) params.set("isFeatured", filters.isFeatured);

      return params.toString();
    },
    [filters, pagination.limit]
  );

  const fetchProducts = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        const queryString = buildQueryString(page);
        const response = await fetch(`/api/admin/products?${queryString}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [buildQueryString]
  );

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts, refreshKey]);

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Refresh the products list
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleFormSubmit = async (productData: any) => {
    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save product");
      }

      // Refresh the products list and close form
      setRefreshKey((prev) => prev + 1);
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    // Reset to page 1 when filters change
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  if (showForm) {
    return (
      <Container>
        <Header>
          <div>
            <Title>{editingProduct ? "Edit Product" : "Add New Product"}</Title>
            <Subtitle>
              {editingProduct
                ? "Update product information, attributes, and images"
                : "Create a new product with attributes and images"}
            </Subtitle>
          </div>
        </Header>

        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>Product Management</Title>
          <Subtitle>
            Manage your product catalog with dynamic attributes and multilingual support
          </Subtitle>
        </div>
        <AddButton onClick={handleAdd}>Add Product</AddButton>
      </Header>

      <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <ContentArea>
        {error && <ErrorState>{error}</ErrorState>}

        {loading ? (
          <LoadingState>Loading products...</LoadingState>
        ) : (
          <ProductTable
            products={products}
            pagination={pagination}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
          />
        )}
      </ContentArea>
    </Container>
  );
};

export default ProductManagement;
