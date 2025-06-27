"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import CategoryFilters from "./CategoryFilters";

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.header`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #2b3445;
  margin: 0;
`;

const PageDescription = styled.p`
  color: #7d879c;
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
`;

const Container = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2b3445;
  margin: 0;
`;

const CreateButton = styled.button`
  background: #2b3445;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1e2633;
  }
`;

const Content = styled.div`
  padding: 2rem;
`;

const LoadingState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #7d879c;
`;

const ErrorMessage = styled.div`
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  padding: 1rem;
  color: #c53030;
  margin-bottom: 1rem;
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
  translations?: Array<{
    id: string;
    languageId: string;
    displayName: string;
    description?: string;
    language: {
      id: string;
      code: string;
      name: string;
    };
  }>;
}

interface Filters {
  search: string;
  parentId: string;
  isActive: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    parentId: "",
    isActive: "all",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories?includeInactive=true");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      setError("Error fetching categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = [...categories];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchLower) ||
          category.displayName?.toLowerCase().includes(searchLower) ||
          category.description?.toLowerCase().includes(searchLower)
      );
    }

    // Parent filter
    if (filters.parentId) {
      filtered = filtered.filter((category) => category.parentId === filters.parentId);
    }

    // Active status filter
    if (filters.isActive !== "all") {
      filtered = filtered.filter((category) => category.isActive === (filters.isActive === "true"));
    }

    setFilteredCategories(filtered);
  }, [categories, filters]);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCategories();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete category");
      }
    } catch (err) {
      setError("Error deleting category");
      console.error("Error deleting category:", err);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingCategory(null);
        await fetchCategories();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category");
      }
    } catch (err) {
      throw err; // Let the form handle the error display
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Category Management</PageTitle>
        <PageDescription>
          Manage product categories, create hierarchical structures, and organize your product
          catalog.
        </PageDescription>
      </PageHeader>

      {showForm && (
        <Container>
          <Header>
            <Title>{editingCategory ? "Edit Category" : "Create New Category"}</Title>
          </Header>
          <Content>
            <CategoryForm
              category={editingCategory}
              categories={categories}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </Content>
        </Container>
      )}

      {loading ? (
        <Container>
          <Content>
            <LoadingState>Loading categories...</LoadingState>
          </Content>
        </Container>
      ) : (
        <Container>
          <Header>
            <Title>Categories ({filteredCategories.length})</Title>
            <CreateButton onClick={handleCreate}>Create Category</CreateButton>
          </Header>

          <Content>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <CategoryFilters
              filters={filters}
              categories={categories}
              onChange={handleFiltersChange}
            />

            <CategoryTable
              categories={filteredCategories}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Content>
        </Container>
      )}
    </PageContainer>
  );
};

export default CategoryManagement;
