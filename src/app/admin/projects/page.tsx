"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/NewAdmin/layout/AdminLayout";
import { Card, CardContent } from "@/components/NewAdmin/ui/Card";
import { Button, ButtonGroup } from "@/components/NewAdmin/ui/Button";
import { Input, Select } from "@/components/NewAdmin/ui/Form";
import ProjectsTable from "@/components/NewAdmin/projects/ProjectsTable";
import ProjectForm from "@/components/NewAdmin/projects/ProjectForm";
import { ProjectDetail, ProjectCreateUpdateRequest } from "@/api/generated/interfaces";
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
  max-width: 900px;
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

const ProjectsManagement = () => {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("/api/projects/admin/projects/");
      setProjects(response.data);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(
          response.data.map((p: ProjectDetail) => p.category).filter((c): c is string => Boolean(c))
        )
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to load projects:", error);
      alert("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project: ProjectDetail) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (project: ProjectDetail) => {
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        setLoading(true);
        await adminAxios.delete(`/api/projects/admin/projects/${project.id}/delete/`);
        await loadProjects();
        alert("Project deleted successfully!");
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete project. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTogglePublished = async (project: ProjectDetail) => {
    try {
      setLoading(true);
      await adminAxios.patch(`/api/projects/admin/projects/${project.id}/update/`, {
        is_published: !project.is_published,
      });
      await loadProjects();
    } catch (error) {
      console.error("Failed to update project status:", error);
      alert("Failed to update project status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any, images: File[]) => {
    try {
      setLoading(true);

      // Generate slug from title if not provided
      const slug =
        formData.slug ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .substring(0, 100);

      const projectData: ProjectCreateUpdateRequest = {
        title: formData.title,
        slug: slug,
        description: formData.description,
        short_description: formData.short_description || undefined,
        client: formData.client || undefined,
        location: formData.location || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        category: formData.category || undefined,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
        sort_order: formData.sort_order ? parseInt(formData.sort_order) : 0,
      };

      // Add translations if any (note: this field is not in the TypeScript interface yet)
      const projectDataWithTranslations: any = {
        ...projectData,
        translations:
          formData.translations && formData.translations.length > 0
            ? formData.translations
            : undefined,
      };

      let projectId: number;

      if (editingProject) {
        const response = await adminAxios.patch(
          `/api/projects/admin/projects/${editingProject.id}/update/`,
          projectDataWithTranslations
        );
        projectId = response.data.id;
        alert("Project updated successfully!");
      } else {
        const response = await adminAxios.post(
          "/api/projects/admin/projects/create/",
          projectDataWithTranslations
        );
        projectId = response.data.id;
        alert("Project created successfully!");
      }

      // Upload images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.append("image", images[i]);
          formData.append("is_primary", i === 0 ? "true" : "false");
          formData.append("sort_order", i.toString());

          try {
            await adminAxios.post(
              `/api/projects/admin/projects/${projectId}/images/upload/`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } catch (error) {
            console.error(`Failed to upload image ${i + 1}:`, error);
          }
        }
      }

      await loadProjects();
      setShowForm(false);
      setEditingProject(null);
    } catch (error: any) {
      console.error("Failed to save project:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save project. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.client && project.client.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && project.is_published) ||
      (statusFilter === "unpublished" && !project.is_published);
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: projects.length,
    published: projects.filter((p) => p.is_published).length,
    featured: projects.filter((p) => p.is_featured).length,
    draft: projects.filter((p) => !p.is_published).length,
  };

  return (
    <AdminLayout>
      <PageHeader>
        <div>
          <h1>Projects</h1>
          <p>Manage your project portfolio and gallery</p>
        </div>
        <Button onClick={handleCreateProject}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Project
        </Button>
      </PageHeader>

      <StatsRow>
        <StatCard>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Projects</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.published}</div>
          <div className="stat-label">Published</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.featured}</div>
          <div className="stat-label">Featured</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.draft}</div>
          <div className="stat-label">Draft</div>
        </StatCard>
      </StatsRow>

      <Card>
        <CardContent>
          <FilterSection>
            <div>
              <Input
                type="search"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </Select>
            </div>
            <div>
              <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <ButtonGroup>
                <Button $variant="secondary" $size="sm">
                  Export
                </Button>
              </ButtonGroup>
            </div>
          </FilterSection>

          <ProjectsTable
            projects={filteredProjects}
            loading={loading}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onTogglePublished={handleTogglePublished}
          />
        </CardContent>
      </Card>

      <Modal $isOpen={showForm}>
        <ModalContent>
          <ModalHeader>
            <h2>{editingProject ? "Edit Project" : "Create New Project"}</h2>
            <CloseButton onClick={handleCloseForm}>×</CloseButton>
          </ModalHeader>

          <ProjectForm
            initialData={editingProject}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            loading={loading}
          />
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
};

export default ProjectsManagement;
