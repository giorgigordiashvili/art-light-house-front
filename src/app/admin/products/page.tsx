"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/NewAdmin/layout/AdminLayout";
import { Card, CardContent } from "@/components/NewAdmin/ui/Card";
import { Button, ButtonGroup } from "@/components/NewAdmin/ui/Button";
import { Input, Select } from "@/components/NewAdmin/ui/Form";
import ProductsTable from "@/components/NewAdmin/products/ProductsTable";
import ProductForm from "@/components/NewAdmin/products/ProductForm";
import { ProductList, ProductCreateUpdateRequest, Category } from "@/api/generated/interfaces";
import {
  productList,
  productDelete,
  productUpdate,
  productCreate,
  categoryList,
} from "@/api/generated/api";
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
  const [editingProduct, setEditingProduct] = useState<ProductList | null>(null);
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
      console.log("🔄 Loading products from API...");
      const productsData = await productList();
      console.log("✅ Products loaded:", productsData);
      setProducts(productsData);
    } catch (error) {
      console.error("❌ Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      console.log("🔄 Loading categories from API...");
      const categoriesData = await categoryList();
      console.log("✅ Categories loaded:", categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("❌ Error loading categories:", error);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: ProductList) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (product: ProductList) => {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      try {
        setLoading(true);
        console.log("🗑️ Deleting product:", product.id);
        await productDelete(product.id);
        console.log("✅ Product deleted successfully");
        // Reload products after successful deletion
        await loadProducts();
      } catch (error) {
        console.error("❌ Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (product: ProductList) => {
    try {
      setLoading(true);
      console.log("🔄 Toggling product status:", product.id, "to", !product.is_active);

      await productUpdate(product.id, {
        is_active: !product.is_active,
      });

      console.log("✅ Product status updated successfully");
      // Reload products after successful update
      await loadProducts();
    } catch (error) {
      console.error("❌ Error updating product status:", error);
      alert("Failed to update product status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any, images: File[]) => {
    try {
      setLoading(true);
      console.log("📝 Submitting product form:", { formData, images });

      // Generate slug from title if not provided
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50);

      // Prepare API data
      const productData: ProductCreateUpdateRequest = {
        title: formData.title,
        description: formData.description,
        slug: slug,
        price: formData.price,
        compare_price: formData.compare_price || undefined,
        sku: formData.sku || undefined,
        barcode: formData.barcode || undefined,
        stock_quantity: formData.track_inventory ? parseInt(formData.stock_quantity) : undefined,
        track_inventory: formData.track_inventory,
        allow_backorder: formData.allow_backorder,
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
        category: formData.category_id ? parseInt(formData.category_id) : undefined,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
      };

      if (editingProduct) {
        console.log("✏️ Updating existing product:", editingProduct.id);
        await productUpdate(editingProduct.id, productData);
        console.log("✅ Product updated successfully");
      } else {
        console.log("🆕 Creating new product");
        await productCreate(productData);
        console.log("✅ Product created successfully");
      }

      // Reload products after successful create/update
      await loadProducts();

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("❌ Error submitting product form:", error);
      alert("Failed to save product. Please try again.");
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
