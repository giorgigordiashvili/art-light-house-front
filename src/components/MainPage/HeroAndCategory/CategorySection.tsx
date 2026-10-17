"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import Container from "../../ui/Container";
import ProductTitle from "./ProductTitle";
import Circle from "@/components/ui/Circle";
import type { HomepageSection } from "@/types/homepage";
import { localized } from "@/utils/localizedText";
import { localizeHref } from "@/utils/localizeHref";
import { resolveCategoryLink } from "@/utils/categoryLink";

// Must mirror images.remotePatterns in next.config; anything else is served unoptimized
// so an unexpected CMS host can never break the homepage.
const OPTIMIZABLE_IMAGE_HOSTS = new Set([
  "testapi.artlighthouse.ge",
  "art-light-house-images.fra1.cdn.digitaloceanspaces.com",
  "echodesk-spaces.fra1.digitaloceanspaces.com",
  "echodesk-media.fsn1.your-objectstorage.com",
]);

const isOptimizableImage = (src: string) => {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZABLE_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
};

interface Props {
  dictionary: any;
  homepageSections?: HomepageSection[];
  lang: string;
}

// ✅ Custom hook to detect window width
function useWindowWidth() {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 44px 0 0 0;
  @media (max-width: 1080px) {
    padding: 26px 0 0 0;
  }
  @media (max-width: 522px) {
    margin-bottom: 91px;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  top: 80px;
  left: 272px;

  @media (max-width: 522px) {
    top: 40px;
    left: 100px;
  }
`;

const ScrollableWrapper = styled.div`
  @media (max-width: 1332px) {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    padding-inline: 20px;
    margin-left: -20px;

    &::-webkit-scrollbar {
      display: none; /* WebKit */
    }
  }

  @media (max-width: 1080px) {
    width: calc(100vw);
    padding-inline: 20px;
    margin-left: -20px;
  }
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: max-content;
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }
  @media (max-width: 1080px) {
    padding-inline: 0;
  }
  @media (max-width: 522px) {
    gap: 10px;
  }
`;

const Row = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isSecond",
})<{ isSecond?: boolean }>`
  display: flex;
  gap: 19px;

  ${(props) => props.isSecond && "height: 223px;"}

  @media (max-width: 578px) {
    ${(props) => props.isSecond && "height: auto;"}
    gap: 10px;
  }
`;

const Card = styled(Link).withConfig({
  shouldForwardProp: (prop) => !["width", "height", "gradient"].includes(prop),
})<{
  width: number;
  height: number;
  gradient?: string;
}>`
  position: relative;
  flex: 0 0 auto;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: #101010;
  border-radius: 32px;
  padding: 38px;
  color: white;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  backdrop-filter: blur(114px);
  z-index: 1;
  cursor: pointer;
  overflow: hidden;
  text-decoration: none;
  transition: box-shadow 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: 32px;
    background: ${(props) => props.gradient || "transparent"};
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
    z-index: 1;
    pointer-events: none;
  }

  &:hover .card-image {
    transform: scale(1.1);
  }

  &:hover {
    box-shadow: 0 0 0 0.5px #ffcb40;
  }

  > *:not(.card-image) {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 522px) {
    padding: 16px;

    .first-row & {
      width: 154px !important;
      height: 92px !important;
    }

    .second-row & {
      &:nth-child(1) {
        width: 210px !important;
        height: 92px !important;
      }

      &:nth-child(2) {
        width: 154px !important;
        height: 92px !important;
      }

      &:nth-child(3) {
        width: 98px !important;
        height: 92px !important;
      }
    }
  }
`;

const CardImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transition: transform 0.2s ease;

  @media (max-width: 522px) {
    left: auto;
    width: 70%;
  }
`;

const CategorySection = ({ homepageSections, lang }: Props) => {
  // Map lang to API language key (ge -> ka)
  const apiLang = lang === "ge" ? "ka" : lang;

  const width = useWindowWidth();
  const [mounted, setMounted] = useState(false);
  const circleSize = width <= 522 ? "mobile" : "medium";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find category_grid section from API
  const categorySection = homepageSections?.find(
    (section: HomepageSection) => section.section_type === "category_grid"
  );

  // Get categories from API and filter active ones
  const apiCategories =
    categorySection?.data
      ?.filter((item: any) => item.is_active)
      ?.sort((a: any, b: any) => a.position - b.position)
      ?.slice(0, 6) || [];

  // Use empty categories while loading (when homepageSections is undefined)
  const categories = !homepageSections ? [] : apiCategories;

  // Split categories into two rows (first row: 3 items, second row: 3 items)
  const firstRowCategories = categories.slice(0, 3);
  const secondRowCategories = categories.slice(3, 6);

  // Define card dimensions for each position
  const getCardDimensions = (rowIndex: number, cardIndex: number) => {
    if (rowIndex === 0) {
      return { width: cardIndex === 2 ? 505 : 374, height: 222 };
    } else {
      return { width: cardIndex === 0 ? 505 : 374, height: 222 };
    }
  };

  const renderCardImage = (src: unknown, cardWidth: number) =>
    typeof src === "string" && src.trim() !== "" ? (
      <CardImage className="card-image">
        <Image
          src={src}
          alt=""
          fill
          sizes={`(max-width: 522px) 210px, ${cardWidth}px`}
          unoptimized={!isOptimizableImage(src)}
          style={{ objectFit: "contain", objectPosition: "right center" }}
          draggable="false"
        />
      </CardImage>
    ) : null;

  // Don't render cards while loading
  if (!homepageSections || categories.length === 0) {
    return null;
  }

  return (
    <Container>
      <StyledContainer>
        <StyledCircle>{mounted && <Circle size={circleSize} />}</StyledCircle>
        <ScrollableWrapper>
          <RowWrapper>
            <Row className="first-row">
              {firstRowCategories.map((category: any, index: number) => {
                const dimensions = getCardDimensions(0, index);
                const nameKey = lang === "en" ? "name_en" : "name_ka";
                const categoryLabel =
                  category.custom_data?.[nameKey] || localized(category.label, apiLang);
                const categoryImage = category.custom_data?.image || category.image;
                const categoryGradient = category.custom_data?.gradient_style || category.gradient;
                const categoryHref = localizeHref(
                  resolveCategoryLink(category.custom_data?.link),
                  lang
                );

                return (
                  <Card
                    key={category.id || index}
                    width={dimensions.width}
                    height={dimensions.height}
                    gradient={categoryGradient}
                    href={categoryHref}
                    draggable={false}
                  >
                    {renderCardImage(categoryImage, dimensions.width)}
                    <ProductTitle text={categoryLabel} />
                  </Card>
                );
              })}
            </Row>

            <Row isSecond className="second-row">
              {secondRowCategories.map((category: any, index: number) => {
                const dimensions = getCardDimensions(1, index);
                const nameKey = lang === "en" ? "name_en" : "name_ka";
                const categoryLabel =
                  category.custom_data?.[nameKey] || localized(category.label, apiLang);
                const categoryImage = category.custom_data?.image || category.image;
                const categoryGradient = category.custom_data?.gradient_style || category.gradient;
                const categoryHref = localizeHref(
                  resolveCategoryLink(category.custom_data?.link),
                  lang
                );

                return (
                  <Card
                    key={category.id || index}
                    width={dimensions.width}
                    height={dimensions.height}
                    gradient={categoryGradient}
                    href={categoryHref}
                    draggable={false}
                  >
                    {renderCardImage(categoryImage, dimensions.width)}
                    <ProductTitle text={categoryLabel} />
                  </Card>
                );
              })}
            </Row>
          </RowWrapper>
        </ScrollableWrapper>
      </StyledContainer>
    </Container>
  );
};

export default CategorySection;
