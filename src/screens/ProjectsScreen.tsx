"use client";
import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
// Client component receives fully prepared project data from server (ISR) and only handles filtering.
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: #0b0b0b;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px 0 50px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 20px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  color: white;

  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #fff 0%, #d4af37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.7);
    max-width: 600px;
    margin: 0 auto;
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 10px 24px;
  border-radius: 25px;
  border: 2px solid ${(props) => (props.$active ? "#d4af37" : "rgba(255, 255, 255, 0.2)")};
  background: ${(props) =>
    props.$active ? "rgba(212, 175, 55, 0.2)" : "rgba(255, 255, 255, 0.05)"};
  color: ${(props) => (props.$active ? "#d4af37" : "white")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #d4af37;
    background: rgba(212, 175, 55, 0.1);
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(Link)`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  &:hover {
    transform: translateY(-5px);
    border-color: #d4af37;
    box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2);

    .image {
      transform: scale(1.05);
    }
  }
`;

const ProjectImageWrapper = styled.div`
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  position: relative;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(212, 175, 55, 0.9);
  color: black;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProjectInfo = styled.div`
  padding: 24px;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);

  strong {
    color: #d4af37;
  }
`;

const ProjectDescription = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.6);

  h3 {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }

  p {
    font-size: 1rem;
  }
`;

interface ProjectsScreenProps {
  dictionary: any;
  initialProjects: ProjectItem[];
  initialCategories: string[];
  initialError?: string | null;
}

type ProjectItem = {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  year?: string;
  location?: string;
  slug?: string;
  isFeatured?: boolean;
};

const stripHtml = (value?: string) => {
  if (!value) return undefined;
  return value.replace(/<[^>]*>/g, "").trim();
};

const ProjectsScreen = ({
  dictionary,
  initialProjects,
  initialCategories,
  initialError,
}: ProjectsScreenProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  // Projects & categories are fixed from server; no client re-fetch required.
  const projects = initialProjects;
  const categories = initialCategories;
  const error = initialError || null;
  const loading = false;

  const filteredProjects = categoryFilter
    ? projects.filter((project) => project.category === categoryFilter)
    : projects;

  return (
    <StyledComponent>
      <Container>
        <Header>
          <h1>{dictionary.projects.title}</h1>
          <p>{dictionary.projects.description}</p>
        </Header>

        {categories.length > 0 && (
          <FilterBar>
            <FilterButton $active={!categoryFilter} onClick={() => setCategoryFilter(undefined)}>
              {dictionary.projects.allProjects}
            </FilterButton>
            {categories.map((category) => (
              <FilterButton
                key={category}
                $active={categoryFilter === category}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </FilterButton>
            ))}
          </FilterBar>
        )}

        {error && !loading && (
          <EmptyState>
            <h3>{dictionary.projects.errorTitle ?? "Unable to load projects"}</h3>
            <p>{error}</p>
          </EmptyState>
        )}
        {filteredProjects.length === 0 ? (
          <EmptyState>
            <h3>No projects found</h3>
            <p>Check back soon for our latest work</p>
          </EmptyState>
        ) : (
          <ProjectsGrid>
            {filteredProjects.map((project) => {
              const projectHref = project.slug ? `/projects/${project.slug}` : "#";
              const descriptionText = stripHtml(project.description);
              return (
                <ProjectCard key={project.id} href={projectHref} className="project-card">
                  <ProjectImageWrapper>
                    <ProjectImage
                      src={project.imageUrl || "/assets/placeholder.png"}
                      alt={project.title}
                      className="image"
                    />
                    {project.isFeatured && <FeaturedBadge>Featured</FeaturedBadge>}
                  </ProjectImageWrapper>
                  <ProjectInfo>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectMeta>
                      {project.category && (
                        <MetaItem>
                          <strong>Category:</strong> {project.category}
                        </MetaItem>
                      )}
                      {project.year && (
                        <MetaItem>
                          <strong>Year:</strong> {project.year}
                        </MetaItem>
                      )}
                      {project.location && (
                        <MetaItem>
                          <strong>Location:</strong> {project.location}
                        </MetaItem>
                      )}
                    </ProjectMeta>
                    {descriptionText && <ProjectDescription>{descriptionText}</ProjectDescription>}
                  </ProjectInfo>
                </ProjectCard>
              );
            })}
          </ProjectsGrid>
        )}
      </Container>

      <BigCircle variant={2} setZIndex />
    </StyledComponent>
  );
};

export default ProjectsScreen;
