"use client";
import { useState } from "react";
import AdminLayout from "@/components/Admin/layout/AdminLayout";
import { Card, CardContent } from "@/components/Admin/ui/Card";
import { Button, ButtonGroup } from "@/components/Admin/ui/Button";
import { Input, Select } from "@/components/Admin/ui/Form";
import CategoriesTable from "@/components/Admin/categories/CategoriesTable";
import CategoryForm from "@/components/Admin/categories/CategoryForm";
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

// Mock data
const mockCategories = [
  {
    id: 1,
    name: "Abstract Art",
    slug: "abstract-art",
    description: "Modern abstract artworks",
    full_path: "Abstract Art",
    is_active: true,
    product_count: 25,
    level: 0,
    created_at: "2024-01-15T10:30:00Z",
    children: [
      {
        id: 5,
        name: "Canvas Paintings",
        slug: "canvas-paintings",
        parent_id: 1,
        full_path: "Abstract Art > Canvas Paintings",
        is_active: true,
        product_count: 15,
        level: 1,
        created_at: "2024-01-20T14:20:00Z",
        children: [],
      },
      {
        id: 6,
        name: "Digital Art",
        slug: "digital-art",
        parent_id: 1,
        full_path: "Abstract Art > Digital Art",
        is_active: true,
        product_count: 10,
        level: 1,
        created_at: "2024-01-22T09:15:00Z",
        children: [],
      },
    ],
  },
  {
    id: 2,
    name: "Sculptures",
    slug: "sculptures",
    description: "Three-dimensional artworks",
    full_path: "Sculptures",
    is_active: true,
    product_count: 12,
    level: 0,
    created_at: "2024-01-10T14:20:00Z",
    children: [
      {
        id: 7,
        name: "Metal Sculptures",
        slug: "metal-sculptures",
        parent_id: 2,
        full_path: "Sculptures > Metal Sculptures",
        is_active: true,
        product_count: 8,
        level: 1,
        created_at: "2024-01-25T11:30:00Z",
        children: [],
      },
    ],
  },
  {
    id: 3,
    name: "Photography",
    slug: "photography",
    description: "Photographic artworks",
    full_path: "Photography",
    is_active: true,
    product_count: 18,
    level: 0,
    created_at: "2024-01-12T16:45:00Z",
    children: [],
  },
  {
    id: 4,
    name: "Vintage Art",
    slug: "vintage-art",
    description: "Classic and vintage pieces",
    full_path: "Vintage Art",
    is_active: false,
    product_count: 0,
    level: 0,
    created_at: "2024-01-08T12:10:00Z",
    children: [],
  },
];

const CategoriesManagement = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [parentForNewCategory, setParentForNewCategory] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setParentForNewCategory(undefined);
    setShowForm(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setParentForNewCategory(undefined);
    setShowForm(true);
  };

  const handleAddChildCategory = (parentCategory: any) => {
    setEditingCategory(null);
    setParentForNewCategory(parentCategory.id);
    setShowForm(true);
  };

  const handleDeleteCategory = (category: any) => {
    if (category.product_count > 0) {
      alert("Cannot delete category with products. Please move or delete products first.");
      return;
    }

    if (category.children && category.children.length > 0) {
      alert("Cannot delete category with subcategories. Please delete subcategories first.");
      return;
    }

    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      const removeCategory = (categories: any[]): any[] => {
        return categories
          .filter((cat) => cat.id !== category.id)
          .map((cat) => ({
            ...cat,
            children: cat.children ? removeCategory(cat.children) : [],
          }));
      };

      setCategories(removeCategory(categories));
    }
  };

  const handleToggleStatus = (category: any) => {
    const updateCategory = (categories: any[]): any[] => {
      return categories.map((cat) => {
        if (cat.id === category.id) {
          return { ...cat, is_active: !cat.is_active };
        }
        return {
          ...cat,
          children: cat.children ? updateCategory(cat.children) : [],
        };
      });
    };

    setCategories(updateCategory(categories));
  };

  const handleFormSubmit = (formData: any) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (editingCategory) {
        const updateCategory = (categories: any[]): any[] => {
          return categories.map((cat) => {
            if (cat.id === editingCategory.id) {
              return {
                ...cat,
                ...formData,
                full_path: formData.parent_id
                  ? `${findCategoryById(parseInt(formData.parent_id))?.full_path} > ${formData.name}`
                  : formData.name,
              };
            }
            return {
              ...cat,
              children: cat.children ? updateCategory(cat.children) : [],
            };
          });
        };

        setCategories(updateCategory(categories));
      } else {
        const newCategory = {
          ...formData,
          id: Math.max(...getAllCategoryIds(categories)) + 1,
          product_count: 0,
          level: formData.parent_id ? findCategoryById(parseInt(formData.parent_id))!.level + 1 : 0,
          created_at: new Date().toISOString(),
          children: [],
          full_path: formData.parent_id
            ? `${findCategoryById(parseInt(formData.parent_id))?.full_path} > ${formData.name}`
            : formData.name,
        };

        if (formData.parent_id) {
          const addToParent = (categories: any[]): any[] => {
            return categories.map((cat) => {
              if (cat.id === parseInt(formData.parent_id)) {
                return {
                  ...cat,
                  children: [...(cat.children || []), newCategory],
                };
              }
              return {
                ...cat,
                children: cat.children ? addToParent(cat.children) : [],
              };
            });
          };
          setCategories(addToParent(categories));
        } else {
          setCategories((prev) => [...prev, newCategory]);
        }
      }

      setShowForm(false);
      setEditingCategory(null);
      setParentForNewCategory(undefined);
      setLoading(false);
    }, 1000);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setParentForNewCategory(undefined);
  };

  const findCategoryById = (id: number): any => {
    const search = (categories: any[]): any => {
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.children) {
          const found = search(category.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(categories);
  };

  const getAllCategoryIds = (categories: any[]): number[] => {
    const ids: number[] = [];
    const collect = (cats: any[]) => {
      for (const cat of cats) {
        ids.push(cat.id);
        if (cat.children) collect(cat.children);
      }
    };
    collect(categories);
    return ids;
  };

  const flattenCategoriesForDisplay = (categories: any[]): any[] => {
    const flattened: any[] = [];
    const flatten = (cats: any[], level = 0) => {
      for (const cat of cats) {
        flattened.push({ ...cat, level });
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children, level + 1);
        }
      }
    };
    flatten(categories);
    return flattened;
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && category.is_active) ||
      (statusFilter === "inactive" && !category.is_active);
    return matchesSearch && matchesStatus;
  });

  const allCategories = flattenCategoriesForDisplay(categories);
  const stats = {
    total: allCategories.length,
    active: allCategories.filter((c) => c.is_active).length,
    withProducts: allCategories.filter((c) => c.product_count > 0).length,
    rootLevel: categories.length,
  };

  const renderTreeVisualization = (categories: any[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id}>
        <TreeNode $level={level}>
          <span className="node-name">{category.name}</span>
          <span className="node-info">
            ({category.product_count} products)
            {!category.is_active && " - Inactive"}
          </span>
        </TreeNode>
        {category.children &&
          category.children.length > 0 &&
          renderTreeVisualization(category.children, level + 1)}
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
          <div className="stat-value">{stats.withProducts}</div>
          <div className="stat-label">With Products</div>
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
            loading={false}
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
            categories={allCategories}
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
