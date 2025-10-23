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
import { ProjectDetail } from "@/api/generated/interfaces";
import styled from "styled-components";

const ProjectImage = styled.img`
  width: 64px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
`;

const StatusBadge = styled.span<{ $status: "published" | "unpublished" }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) => (props.$status === "published" ? "#d4edda" : "#fff3cd")};
  color: ${(props) => (props.$status === "published" ? "#155724" : "#856404")};
`;

const FeaturedBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #d4af37;
  color: white;
  margin-left: 8px;
`;

interface ProjectsTableProps {
  projects: ProjectDetail[];
  loading?: boolean;
  onEdit: (project: ProjectDetail) => void;
  onDelete: (project: ProjectDetail) => void;
  onTogglePublished: (project: ProjectDetail) => void;
}

const ProjectsTable = ({
  projects,
  loading = false,
  onEdit,
  onDelete,
  onTogglePublished,
}: ProjectsTableProps) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 8.58c0-2.5-3.97-3.58-6-3.58s-6 1.08-6 3.58V17h12v-1.42zM8.48 15c.74-.51 2.23-1 3.52-1s2.78.49 3.52 1H8.48z" />
        </svg>
        <h3>No projects found</h3>
        <p>Start by adding your first project to the portfolio.</p>
      </EmptyState>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ProjectImage
                  src={project.primary_image_url || "/assets/placeholder.png"}
                  alt={project.title}
                />
                <div>
                  <div style={{ fontWeight: 500, display: "flex", alignItems: "center" }}>
                    {project.title}
                    {project.is_featured && <FeaturedBadge>Featured</FeaturedBadge>}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6c757d" }}>
                    {project.location || "No location"}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{project.client || "—"}</TableCell>
            <TableCell>{project.category || "Uncategorized"}</TableCell>
            <TableCell>{project.year || "—"}</TableCell>
            <TableCell>
              <StatusBadge $status={project.is_published ? "published" : "unpublished"}>
                {project.is_published ? "Published" : "Draft"}
              </StatusBadge>
            </TableCell>
            <TableCell>
              <TableActions>
                <Button $variant="secondary" $size="sm" onClick={() => onEdit(project)}>
                  Edit
                </Button>
                <Button
                  $variant={project.is_published ? "secondary" : "success"}
                  $size="sm"
                  onClick={() => onTogglePublished(project)}
                >
                  {project.is_published ? "Unpublish" : "Publish"}
                </Button>
                <Button $variant="danger" $size="sm" onClick={() => onDelete(project)}>
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

export default ProjectsTable;
