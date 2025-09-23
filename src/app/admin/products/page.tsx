"use client";
import { useState } from "react";
import AdminLayout from "@/components/NewAdmin/layout/AdminLayout";
import { Card, CardContent } from "@/components/NewAdmin/ui/Card";
import { Button, ButtonGroup } from "@/components/NewAdmin/ui/Button";
import { Input, Select } from "@/components/NewAdmin/ui/Form";
import ProductsTable from "@/components/NewAdmin/products/ProductsTable";
import ProductForm from "@/components/NewAdmin/products/ProductForm";
import styled from "styled-components";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px 200px auto;
  gap: 16px;
  align-items: end;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #007bff;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;

  &:hover {
    color: #212529;
  }
`;

// Mock data - replace with API calls
const mockProducts = [
  {
    id: 1,
    title: "Abstract Canvas Art",
    slug: "abstract-canvas-art",
    description: "Beautiful abstract artwork on canvas",
    price: 299.99,
    compare_price: 399.99,
    stock_quantity: 15,
    is_active: true,
    is_featured: true,
    category: { id: 1, name: "Abstract Art" },
    images: [{ id: 1, image_url: "/assets/art1.jpg", is_primary: true }],
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Modern Sculpture",
    slug: "modern-sculpture",
    description: "Contemporary metal sculpture",
    price: 1299.99,
    stock_quantity: 3,
    is_active: true,
    is_featured: false,
    category: { id: 2, name: "Sculptures" },
    images: [{ id: 2, image_url: "/assets/art2.jpg", is_primary: true }],
    created_at: "2024-01-10T14:20:00Z",
  },
];

const mockCategories = [
  { id: 1, name: "Abstract Art" },
  { id: 2, name: "Sculptures" },
  { id: 3, name: "Paintings" },
  { id: 4, name: "Photography" },
];

const ProductsManagement = () => {
  const [products, setProducts] = useState(mockProducts);
  const [categories] = useState(mockCategories);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (product: any) => {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  const handleToggleStatus = (product: any) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
    );
  };

  const handleFormSubmit = (formData: any) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...p, ...formData, id: editingProduct.id } : p
          )
        );
      } else {
        const newProduct = {
          ...formData,
          id: Math.max(...products.map((p) => p.id)) + 1,
          created_at: new Date().toISOString(),
        };
        setProducts((prev) => [...prev, newProduct]);
      }

      setShowForm(false);
      setEditingProduct(null);
      setLoading(false);
    }, 1000);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);
    const matchesCategory =
      categoryFilter === "all" || product.category?.id.toString() === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: products.length,
    active: products.filter((p) => p.is_active).length,
    outOfStock: products.filter((p) => p.stock_quantity === 0).length,
    featured: products.filter((p) => p.is_featured).length,
  };

  return (
    <AdminLayout>
      <PageHeader>
        <div>
          <h1>Products</h1>
          <p>Manage your product catalog, inventory, and pricing</p>
        </div>
        <Button onClick={handleCreateProduct}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Product
        </Button>
      </PageHeader>

      <StatsRow>
        <StatCard>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Products</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active Products</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.outOfStock}</div>
          <div className="stat-label">Out of Stock</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.featured}</div>
          <div className="stat-label">Featured Products</div>
        </StatCard>
      </StatsRow>

      <Card>
        <CardContent>
          <FilterSection>
            <div>
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
            <div>
              <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <ButtonGroup>
                <Button $variant="secondary" $size="sm">
                  Export
                </Button>
                <Button $variant="secondary" $size="sm">
                  Import
                </Button>
              </ButtonGroup>
            </div>
          </FilterSection>

          <ProductsTable
            products={filteredProducts}
            loading={false}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

      <Modal $isOpen={showForm}>
        <ModalContent>
          <ModalHeader>
            <h2>{editingProduct ? "Edit Product" : "Create New Product"}</h2>
            <CloseButton onClick={handleCloseForm}>×</CloseButton>
          </ModalHeader>

          <ProductForm
            initialData={editingProduct}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            loading={loading}
          />
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
};

export default ProductsManagement;
