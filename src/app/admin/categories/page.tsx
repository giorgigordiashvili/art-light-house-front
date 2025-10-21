"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/NewAdmin/layout/AdminLayout";
import { Card, CardContent } from "@/components/NewAdmin/ui/Card";
import { Button, ButtonGroup } from "@/components/NewAdmin/ui/Button";
import { Input, Select } from "@/components/NewAdmin/ui/Form";
import CategoriesTable from "@/components/NewAdmin/categories/CategoriesTable";
import CategoryForm from "@/components/NewAdmin/categories/CategoryForm";
import styled from "styled-components";
import { AdminCategory, AdminCategoryRequest } from "@/api/generated/interfaces";
import adminAxios from "@/api/admin-axios";

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
  grid-template-columns: 1fr 200px auto;
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
  max-width: 600px;
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

const TreeVisualization = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;

  h3 {
    margin: 0 0 16px 0;
    font-size: 1.125rem;
    font-weight: 600;
  }
`;

const TreeNode = styled.div<{ $level: number }>`
  margin-left: ${(props) => props.$level * 20}px;
  padding: 8px 0;
  font-size: 0.875rem;

  &::before {
    content: ${(props) => (props.$level > 0 ? '"├── "' : '""')};
    color: #6c757d;
  }

  .node-name {
    font-weight: 500;
  }

  .node-info {
    color: #6c757d;
    font-size: 0.75rem;
    margin-left: 8px;
  }
`;

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [parentForNewCategory, setParentForNewCategory] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("/api/products/admin/categories/");
      setCategories(response.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setParentForNewCategory(undefined);
    setShowForm(true);
  };

  const handleEditCategory = (category: AdminCategory) => {
    setEditingCategory(category);
    setParentForNewCategory(undefined);
    setShowForm(true);
  };

  const handleAddChildCategory = (parentCategory: AdminCategory) => {
    setEditingCategory(null);
    setParentForNewCategory(parentCategory.id);
    setShowForm(true);
  };

  const handleDeleteCategory = async (category: AdminCategory) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        setLoading(true);
        await adminAxios.delete(`/api/products/admin/categories/${category.id}/delete/`);
        await loadCategories();
      } catch {
        alert("Failed to delete category. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (category: AdminCategory) => {
    try {
      setLoading(true);
      await adminAxios.patch(`/api/products/admin/categories/${category.id}/update/`, {
        is_active: !category.is_active,
      });
      await loadCategories();
    } catch {
      alert("Failed to update category status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setLoading(true);

      // Prepare API data
      const categoryData: AdminCategoryRequest = {
        name: formData.name,
        description: formData.description || undefined,
        slug:
          formData.slug ||
          formData.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-"),
        parent:
          parentForNewCategory || (formData.parent_id ? parseInt(formData.parent_id) : undefined),
        is_active: formData.is_active ?? true,
      };

      if (editingCategory) {
        await adminAxios.patch(
          `/api/products/admin/categories/${editingCategory.id}/update/`,
          categoryData
        );
      } else {
        await adminAxios.post("/api/products/admin/categories/create/", categoryData);
      }

      // Reload categories after successful create/update
      await loadCategories();

      setShowForm(false);
      setEditingCategory(null);
      setParentForNewCategory(undefined);
    } catch {
      alert("Failed to save category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setParentForNewCategory(undefined);
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && category.is_active) ||
      (statusFilter === "inactive" && !category.is_active);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.is_active).length,
    withSubcategories: categories.filter(
      (c) => c.subcategories_count && parseInt(c.subcategories_count) > 0
    ).length,
    rootLevel: categories.length,
  };

  const renderTreeVisualization = (categories: AdminCategory[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id}>
        <TreeNode $level={level}>
          <span className="node-name">{category.name}</span>
          <span className="node-info">
            {category.full_path}
            {!category.is_active && " - Inactive"}
          </span>
        </TreeNode>
      </div>
    ));
  };

  return (
    <AdminLayout>
      <PageHeader>
        <div>
          <h1>Categories</h1>
          <p>Organize your products with hierarchical categories</p>
        </div>
        <Button onClick={handleCreateCategory}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Category
        </Button>
      </PageHeader>

      <StatsRow>
        <StatCard>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Categories</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active Categories</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.withSubcategories}</div>
          <div className="stat-label">With Subcategories</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.rootLevel}</div>
          <div className="stat-label">Root Categories</div>
        </StatCard>
      </StatsRow>

      <TreeVisualization>
        <h3>Category Hierarchy</h3>
        {renderTreeVisualization(categories)}
      </TreeVisualization>

      <Card>
        <CardContent>
          <FilterSection>
            <div>
              <Input
                type="search"
                placeholder="Search categories..."
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

          <CategoriesTable
            categories={filteredCategories}
            loading={loading}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onToggleStatus={handleToggleStatus}
            onAddChild={handleAddChildCategory}
          />
        </CardContent>
      </Card>

      <Modal $isOpen={showForm}>
        <ModalContent>
          <ModalHeader>
            <h2>
              {editingCategory
                ? "Edit Category"
                : parentForNewCategory
                  ? "Create Child Category"
                  : "Create New Category"}
            </h2>
            <CloseButton onClick={handleCloseForm}>×</CloseButton>
          </ModalHeader>

          <CategoryForm
            initialData={editingCategory}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            loading={loading}
            parentId={parentForNewCategory}
          />
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
};

export default CategoriesManagement;
