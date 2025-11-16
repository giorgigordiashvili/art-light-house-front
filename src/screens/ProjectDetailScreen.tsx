"use client";
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Link from "next/link";
import {
  ecommerceClientItemListsList,
  ecommerceClientItemListsRetrieve,
  ecommerceClientItemListsItemsRetrieve,
} from "@/api/generated/api";
import NewCircle from "@/components/ui/NewCircle";
import Circle from "@/components/ui/Circle";
import BigCircle from "@/components/ui/BigCircle";

interface ProjectDetailScreenProps {
  slug: string;
  dictionary: any;
  lang: string;
}

type ProjectGalleryImage = {
  id: string;
  image_url: string;
  alt_text?: string;
};

interface ProjectDetail {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  client?: string;
  category?: string;
  year?: string;
  location?: string;
  is_featured?: boolean;
  primary_image_url?: string;
  images: ProjectGalleryImage[];
}

const parseListItems = (items: unknown): any[] => {
  if (Array.isArray(items)) {
    return items as any[];
  }

  try {
    const serialized = typeof items === "string" ? (items as string) : JSON.stringify(items ?? []);
    const parsed = JSON.parse(serialized || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const toGalleryArray = (gallery: unknown): any[] => {
  if (!gallery) return [];
  if (Array.isArray(gallery)) return gallery;

  if (typeof gallery === "string") {
    try {
      const parsed = JSON.parse(gallery);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return [gallery];
    }
    return [gallery];
  }

  return [gallery];
};

const parseCustomData = (customData: unknown): Record<string, any> => {
  if (!customData) return {};
  if (typeof customData === "string") {
    try {
      const parsed = JSON.parse(customData);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  if (typeof customData === "object") {
    return customData as Record<string, any>;
  }

  return {};
};

const buildGalleryImages = (gallery: any, fallbackTitle: string): ProjectGalleryImage[] =>
  toGalleryArray(gallery)
    .map((entry: any, index: number): ProjectGalleryImage | null => {
      if (!entry) return null;
      if (typeof entry === "string") {
        return {
          id: `gallery-${index}`,
          image_url: entry,
          alt_text: fallbackTitle,
        };
      }

      if (typeof entry === "object") {
        const imageUrl =
          entry.image_url ||
          entry.image ||
          entry.url ||
          entry.src ||
          (typeof entry.file === "string" ? entry.file : undefined);
        if (!imageUrl) return null;
        return {
          id: String(entry.id ?? `gallery-${index}`),
          image_url: imageUrl,
          alt_text: entry.alt_text || entry.title || fallbackTitle,
        };
      }

      return null;
    })
    .filter((value): value is ProjectGalleryImage => value !== null);

const getItemSlugCandidates = (item: any) => {
  const customData = parseCustomData(item?.custom_data);
  return [customData.slug, item?.custom_id, item?.id != null ? String(item.id) : null]
    .filter(Boolean)
    .map((value) => String(value).trim().toLowerCase());
};

const buildProjectDetail = (item: any): ProjectDetail => {
  const customData = parseCustomData(item?.custom_data);
  const galleryImages = buildGalleryImages(
    customData.gallery || customData.images,
    customData.title || item?.label || "Project"
  );
  const imageFromCustom = customData.image || customData.primary_image;
  const numericId = typeof item?.id === "number" ? item.id : Number(item?.id ?? 0);
  const imageFallback = imageFromCustom
    ? [
        {
          id: "primary",
          image_url: imageFromCustom,
          alt_text: customData.title || item?.label,
        },
      ]
    : [];
  const images = galleryImages.length > 0 ? galleryImages : imageFallback;

  return {
    id: Number.isNaN(numericId) ? 0 : numericId,
    title: customData.title || item?.label || `Project ${item?.id}`,
    short_description: customData.short_description,
    description: customData.description,
    client: customData.client,
    category: customData.category || customData.type,
    year: customData.year,
    location: customData.location,
    is_featured: Boolean(customData.is_featured ?? item?.is_active),
    primary_image_url: images[0]?.image_url,
    images,
  };
};

const normalizeSlugValue = (value: string) => {
  try {
    return decodeURIComponent(value).trim().toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
};

const StyledComponent = styled.div`
  background: #0b0b0b;
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

const SkeletonWrapper = styled.div`
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

const SkeletonBox = styled.div<{ width?: string; height?: string; borderRadius?: string }>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "20px"};
  border-radius: ${(props) => props.borderRadius || "8px"};
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
`;

const SkeletonHeader = styled.div`
  margin-bottom: 50px;
`;

const SkeletonTitle = styled(SkeletonBox)`
  width: 60%;
  height: 48px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    width: 80%;
    height: 32px;
  }
`;

const SkeletonMetaRow = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const SkeletonMetaItem = styled(SkeletonBox)`
  width: 120px;
  height: 16px;
`;

const SkeletonBadge = styled(SkeletonBox)`
  width: 100px;
  height: 32px;
  border-radius: 20px;
`;

const SkeletonImageGallery = styled.div`
  margin-bottom: 50px;
`;

const SkeletonMainImage = styled(SkeletonBox)`
  width: 100%;
  height: 600px;
  border-radius: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const SkeletonThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
`;

const SkeletonThumbnail = styled(SkeletonBox)`
  height: 120px;
  border-radius: 8px;
`;

const SkeletonContentSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const SkeletonContentTitle = styled(SkeletonBox)`
  width: 200px;
  height: 28px;
  margin-bottom: 24px;
`;

const SkeletonTextLine = styled(SkeletonBox)`
  margin-bottom: 12px;

  &:last-child {
    width: 75%;
  }
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

const DecorCircleWrapper = styled.div`
  position: absolute;
  bottom: -1200px;
  left: 38%;
  transform: translateX(-50%);
  @media (max-width: 1080px) {
    display: none;
  }
`;

const ProjectDetailScreen = ({ dictionary, lang, slug }: ProjectDetailScreenProps) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const listsResponse = await ecommerceClientItemListsList();
      const activeList = listsResponse.results?.[0];

      if (!activeList) {
        throw new Error("Projects list is not configured yet.");
      }

      const listDetail = await ecommerceClientItemListsRetrieve(activeList.id);
      const rawItems = parseListItems(listDetail.items);
      const normalizedSlug = normalizeSlugValue(slug);

      const targetItem = rawItems.find((item: any) => {
        const candidates = getItemSlugCandidates(item);
        return candidates.includes(normalizedSlug);
      });

      if (!targetItem) {
        throw new Error("Project not found.");
      }

      if (!targetItem.id) {
        throw new Error("Project item is missing an identifier.");
      }

      const detailedItem = await ecommerceClientItemListsItemsRetrieve(
        activeList.id,
        String(targetItem.id)
      );

      setProject(buildProjectDetail(detailedItem));
      setSelectedImageIndex(0);
    } catch (err) {
      console.error("Failed to load project:", err);
      const message =
        (err as any)?.response?.data?.message ||
        (err instanceof Error ? err.message : null) ||
        "Failed to load project. It may not exist or has been removed.";
      setError(message);
      setProject(null);
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
          <BackButton href={`/${lang}/projects`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            {dictionary.projects.backToProjects}
          </BackButton>

          <SkeletonWrapper>
            <SkeletonHeader>
              <SkeletonTitle />
              <SkeletonMetaRow>
                <SkeletonMetaItem />
                <SkeletonMetaItem />
                <SkeletonMetaItem />
              </SkeletonMetaRow>
              <SkeletonBadge />
            </SkeletonHeader>

            <SkeletonImageGallery>
              <SkeletonMainImage />
              <SkeletonThumbnailGrid>
                <SkeletonThumbnail />
                <SkeletonThumbnail />
                <SkeletonThumbnail />
                <SkeletonThumbnail />
              </SkeletonThumbnailGrid>
            </SkeletonImageGallery>

            <SkeletonContentSection>
              <SkeletonContentTitle />
              <SkeletonTextLine />
              <SkeletonTextLine />
              <SkeletonTextLine />
              <SkeletonTextLine />
            </SkeletonContentSection>
          </SkeletonWrapper>
        </Container>

        <NewCircle size="small" top="1000px" right="142px" media="no" />
        <DecorCircleWrapper>
          <Circle size="large" />
        </DecorCircleWrapper>
        <BigCircle variant={2} setZIndex />
      </StyledComponent>
    );
  }

  if (error || !project) {
    return (
      <StyledComponent>
        <Container>
          <ErrorContainer>
            <h3>{dictionary.projects?.errorTitle ?? "Project Not Found"}</h3>
            <p>{error || dictionary.projects?.errorDescription || "Please try again later."}</p>
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
  const hasImages = images.length > 0 || Boolean(project.primary_image_url);
  const currentImage = images[selectedImageIndex] || {
    image_url: project.primary_image_url || "/assets/placeholder.png",
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

        {hasImages && (
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
              dangerouslySetInnerHTML={{ __html: project.description || "" }}
            />
          </ContentSection>
        )}
      </Container>

      <NewCircle size="small" top="1000px" right="142px" media="no" />
      <BigCircle variant={2} setZIndex />
    </StyledComponent>
  );
};

export default ProjectDetailScreen;
