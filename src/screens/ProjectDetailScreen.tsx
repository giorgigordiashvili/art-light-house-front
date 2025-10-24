"use client";
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Link from "next/link";
import { projectsDetail } from "@/api/generated/api";
import { ProjectDetail } from "@/api/generated/interfaces";
import NewCircle from "@/components/ui/NewCircle";
import Circle from "@/components/ui/Circle";
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  padding: 100px 0 50px;
  color: white;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #d4af37;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 40px;
  transition: all 0.3s ease;

  &:hover {
    gap: 12px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Header = styled.div`
  margin-bottom: 50px;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #fff 0%, #d4af37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const MetaItem = styled.div`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.6);

  strong {
    color: #d4af37;
    margin-right: 8px;
  }
`;

const FeaturedBadge = styled.span`
  display: inline-block;
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid #d4af37;
`;

const ImageGallery = styled.div`
  margin-bottom: 50px;
`;

const MainImage = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    height: 400px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
`;

const Thumbnail = styled.div<{ $active?: boolean }>`
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${(props) => (props.$active ? "#d4af37" : "rgba(255, 255, 255, 0.1)")};
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);

  &:hover {
    border-color: #d4af37;
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContentSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;

  @media (max-width: 768px) {
    padding: 24px;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 24px;
    color: #d4af37;
  }

  .description-content {
    font-size: 1rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.8);

    p {
      margin-bottom: 16px;
    }

    h3,
    h4 {
      color: white;
      margin-top: 24px;
      margin-bottom: 12px;
    }

    ul,
    ol {
      margin-left: 24px;
      margin-bottom: 16px;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: white;
  font-size: 1.125rem;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.6);

  h3 {
    font-size: 1.5rem;
    margin-bottom: 12px;
    color: white;
  }

  p {
    font-size: 1rem;
    margin-bottom: 24px;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  bottom: -1200px;
  left: 38%;
  transform: translateX(-50%);
  @media (max-width: 1080px) {
    display: none;
  }
`;

interface ProjectDetailScreenProps {
  slug: string;
  dictionary: any;
  lang: string;
}

const ProjectDetailScreen = ({ slug, dictionary, lang }: ProjectDetailScreenProps) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsDetail(slug);
      setProject(data);
    } catch (err) {
      console.error("Failed to load project:", err);
      setError("Failed to load project. It may not exist or has been removed.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  if (loading) {
    return (
      <StyledComponent>
        <Container>
          <LoadingContainer>Loading project...</LoadingContainer>
        </Container>
      </StyledComponent>
    );
  }

  if (error || !project) {
    return (
      <StyledComponent>
        <Container>
          <ErrorContainer>
            <h3>Project Not Found</h3>
            <p>{error}</p>
            <BackButton href={`/${lang}/projects`}>
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              {dictionary.projects.backToProjects}
            </BackButton>
          </ErrorContainer>
        </Container>
      </StyledComponent>
    );
  }

  const images = project.images || [];
  const currentImage = images[selectedImageIndex] || {
    image_url: project.primary_image_url,
    alt_text: project.title,
  };

  return (
    <StyledComponent>
      <Container>
        <BackButton href={`/${lang}/projects`}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {dictionary.projects.backToProjects}
        </BackButton>

        <Header>
          <h1>{project.title}</h1>
          <MetaInfo>
            {project.client && (
              <MetaItem>
                <strong>{dictionary.projects.client}:</strong> {project.client}
              </MetaItem>
            )}
            {project.category && (
              <MetaItem>
                <strong>{dictionary.projects.category}:</strong> {project.category}
              </MetaItem>
            )}
            {project.year && (
              <MetaItem>
                <strong>{dictionary.projects.year}:</strong> {project.year}
              </MetaItem>
            )}
            {project.location && (
              <MetaItem>
                <strong>{dictionary.projects.location}:</strong> {project.location}
              </MetaItem>
            )}
          </MetaInfo>
          {project.is_featured && (
            <FeaturedBadge>{dictionary.projects.featuredProject}</FeaturedBadge>
          )}
        </Header>

        {images.length > 0 && (
          <ImageGallery>
            <MainImage>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentImage.image_url} alt={currentImage.alt_text || project.title} />
            </MainImage>

            {images.length > 1 && (
              <ThumbnailGrid>
                {images.map((image, index) => (
                  <Thumbnail
                    key={image.id}
                    $active={index === selectedImageIndex}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.image_url} alt={image.alt_text || `Image ${index + 1}`} />
                  </Thumbnail>
                ))}
              </ThumbnailGrid>
            )}
          </ImageGallery>
        )}

        {(project.short_description || project.description) && (
          <ContentSection>
            <h2>{dictionary.projects.projectDetails}</h2>
            {project.short_description && (
              <div style={{ marginBottom: "24px", fontSize: "1.125rem", fontWeight: 500 }}>
                {project.short_description}
              </div>
            )}
            <div
              className="description-content"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </ContentSection>
        )}
      </Container>

      <NewCircle size="small" top="1000px" right="142px" media="no" />
      <StyledCircle>
        <Circle size="large" />
      </StyledCircle>
      <BigCircle variant={2} setZIndex />
    </StyledComponent>
  );
};

export default ProjectDetailScreen;
