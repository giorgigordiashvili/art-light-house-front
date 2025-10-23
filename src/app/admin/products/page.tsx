"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/NewAdmin/layout/AdminLayout";
import { Card, CardContent } from "@/components/NewAdmin/ui/Card";
import { Button, ButtonGroup } from "@/components/NewAdmin/ui/Button";
import { Input, Select } from "@/components/NewAdmin/ui/Form";
import ProductsTable from "@/components/NewAdmin/products/ProductsTable";
import ProductForm from "@/components/NewAdmin/products/ProductForm";
import {
  ProductList,
  ProductCreateUpdateRequest,
  Category,
  ProductDetail,
} from "@/api/generated/interfaces";
import adminAxios from "@/api/admin-axios";
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

const ProductsManagement = () => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("/api/products/");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      alert("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await adminAxios.get("/api/products/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = async (product: ProductList) => {
    try {
      setLoading(true);
      // Fetch full product details for editing
      const response = await adminAxios.get(`/api/products/${product.id}/`);
      setEditingProduct(response.data);
      setShowForm(true);
    } catch (error) {
      console.error("Failed to load product details:", error);
      alert("Failed to load product details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product: ProductList) => {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      try {
        setLoading(true);
        await adminAxios.delete(`/api/products/${product.id}/delete/`);
        // Reload products after successful deletion
        await loadProducts();
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (product: ProductList) => {
    try {
      setLoading(true);

      await adminAxios.patch(`/api/products/${product.id}/update/`, {
        is_active: !product.is_active,
      });

      // Reload products after successful update
      await loadProducts();
    } catch (error) {
      console.error("Failed to update product status:", error);
      alert("Failed to update product status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any, images: File[]) => {
    try {
      setLoading(true);

      // Generate slug from title if not provided
      const slug = (formData.slug || formData.title)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50);

      // Prepare API data
      const productData: ProductCreateUpdateRequest = {
        title: formData.title?.trim(),
        description: formData.description?.trim(),
        slug: slug,
        price: formData.price?.toString(),
        compare_price: formData.compare_price ? formData.compare_price.toString() : undefined,
        sku: formData.sku?.trim() || undefined,
        barcode: formData.barcode?.trim() || undefined,
        stock_quantity: formData.track_inventory
          ? parseInt(formData.stock_quantity) || 0
          : undefined,
        track_inventory: Boolean(formData.track_inventory),
        allow_backorder: Boolean(formData.allow_backorder),
        meta_title: formData.meta_title?.trim() || undefined,
        meta_description: formData.meta_description?.trim() || undefined,
        category: formData.category_id ? parseInt(formData.category_id) : undefined,
        is_active: Boolean(formData.is_active),
        is_featured: Boolean(formData.is_featured),
        attributes:
          formData.attributes && formData.attributes.length > 0 ? formData.attributes : undefined,
      };

      console.log("Submitting product data:", productData);

      let productId: number;

      if (editingProduct) {
        console.log(`Updating product ${editingProduct.id}...`);
        const response = await adminAxios.patch(
          `/api/products/${editingProduct.id}/update/`,
          productData
        );
        productId = response.data.id;
        console.log("Product updated:", response.data);
        alert("Product updated successfully!");
      } else {
        console.log("Creating new product...");
        const response = await adminAxios.post("/api/products/create/", productData);
        productId = response.data.id;
        console.log("Product created:", response.data);
        alert("Product created successfully!");
      }

      // Upload images if any
      if (images.length > 0) {
        console.log(`Uploading ${images.length} images...`);
        for (let i = 0; i < images.length; i++) {
          const imageFormData = new FormData();
          imageFormData.append("image", images[i]);
          imageFormData.append("is_primary", i === 0 ? "true" : "false");
          imageFormData.append("sort_order", i.toString());

          try {
            console.log(`Uploading image ${i + 1}/${images.length}...`);
            await adminAxios.post(`/api/products/${productId}/images/upload/`, imageFormData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            console.log(`Image ${i + 1} uploaded successfully`);
          } catch (error: any) {
            console.error(`Failed to upload image ${i + 1}:`, error);
            console.error("Error details:", error.response?.data);
            alert(
              `Failed to upload image ${i + 1}: ${error.response?.data?.error || error.message}`
            );
          }
        }
      }

      // Reload products after successful create/update
      console.log("Reloading products...");
      await loadProducts();

      setShowForm(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error("Failed to save product:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      let errorMessage = "Failed to save product. Please try again.";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          // Try to format field errors
          const errors = Object.entries(error.response.data)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(", ")}`;
              }
              return `${field}: ${messages}`;
            })
            .join("\n");
          if (errors) errorMessage = errors;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);
    const matchesCategory =
      categoryFilter === "all" ||
      categories.find((cat) => cat.id.toString() === categoryFilter)?.name ===
        product.category_name;

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
            loading={loading}
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
