"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { projectsList } from "@/api/generated/api";
import { ProjectList } from "@/api/generated/interfaces";
import NewCircle from "@/components/ui/NewCircle";
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: black;
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

const SkeletonCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 250px;
  background: rgba(255, 255, 255, 0.05);
`;

const SkeletonContent = styled.div`
  padding: 24px;
`;

const SkeletonTitle = styled.div`
  width: 70%;
  height: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-bottom: 12px;
`;

const SkeletonMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const SkeletonMetaItem = styled.div`
  width: 80px;
  height: 14px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const SkeletonDescription = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-bottom: 8px;

  &:nth-child(2) {
    width: 90%;
  }

  &:nth-child(3) {
    width: 75%;
  }
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
}

const ProjectsScreen = ({}: ProjectsScreenProps) => {
  const [projects, setProjects] = useState<ProjectList[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsList(categoryFilter);
      setProjects(data);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map((p) => p.category).filter((c): c is string => Boolean(c)))
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledComponent>
      <Container>
        <Header>
          <h1>Our Projects</h1>
          <p>Explore our portfolio of exceptional interior design and lighting projects</p>
        </Header>

        {categories.length > 0 && (
          <FilterBar>
            <FilterButton $active={!categoryFilter} onClick={() => setCategoryFilter(undefined)}>
              All Projects
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

        {loading ? (
          <ProjectsGrid>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <SkeletonCard key={index}>
                <SkeletonImage />
                <SkeletonContent>
                  <SkeletonTitle />
                  <SkeletonMeta>
                    <SkeletonMetaItem />
                    <SkeletonMetaItem />
                    <SkeletonMetaItem />
                  </SkeletonMeta>
                  <SkeletonDescription />
                  <SkeletonDescription />
                  <SkeletonDescription />
                </SkeletonContent>
              </SkeletonCard>
            ))}
          </ProjectsGrid>
        ) : projects.length === 0 ? (
          <EmptyState>
            <h3>No projects found</h3>
            <p>Check back soon for our latest work</p>
          </EmptyState>
        ) : (
          <ProjectsGrid>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                href={`/projects/${project.slug}`}
                className="project-card"
              >
                <ProjectImageWrapper>
                  <ProjectImage
                    src={project.primary_image_url || "/assets/placeholder.png"}
                    alt={project.title}
                    className="image"
                  />
                  {project.is_featured && <FeaturedBadge>Featured</FeaturedBadge>}
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
                  {project.short_description && (
                    <ProjectDescription>{project.short_description}</ProjectDescription>
                  )}
                </ProjectInfo>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        )}
      </Container>

      <NewCircle size="small" top="1000px" right="142px" media="no" />
      <BigCircle variant={2} />
    </StyledComponent>
  );
};

export default ProjectsScreen;
