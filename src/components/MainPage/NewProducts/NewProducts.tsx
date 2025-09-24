import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import SectionTitle from "../SectionTitle";
import ReturnIcon from "../../Header/ReturnIcon";
import RightSlide from "./RightSlide";
import Container from "../../ui/Container";
import NewProductCard from "./NewProductCard";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";

const StyledContainer = styled.div`
  margin-top: 120px;
  @media (max-width: 1080px) {
    margin-top: 91px;
  }
`;

const StyledTitleAndActions = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }
  @media (max-width: 1080px) {
    padding-inline: 0;
  }
`;

const StyledActions = styled.div`
  display: flex;
  gap: 11px;
  @media (max-width: 1080px) {
    display: none;
  }
`;

const StyledCards = styled.div<{ $isDragging: boolean }>`
  display: flex;
  gap: 20px;
  margin-top: 39px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-behavior: ${({ $isDragging }) => ($isDragging ? "auto" : "smooth")};
  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
  user-select: none;

  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    flex-shrink: 0;
    pointer-events: ${({ $isDragging }) => ($isDragging ? "none" : "auto")};
  }

  &:active {
    cursor: grabbing;
  }

  @media (max-width: 1332px) {
    padding-inline: 20px;
  }

  @media (max-width: 1080px) {
    width: calc(100vw);
    padding-inline: 0;
    padding-left: 20px;
    padding-right: 20px;
    margin-left: -20px;
    gap: 15px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 356px;
  color: #ffffff;
  font-size: 16px;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 356px;
  color: #ff4444;
  font-size: 16px;
  text-align: center;
`;

const NewProducts = ({ dictionary }: any) => {
  const { featuredProducts, loading, error } = useFeaturedProducts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Add global mouse event listeners for better drag experience
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current) return;

      e.preventDefault();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, startX, scrollLeft]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);

    // Prevent text selection and default drag behavior
    e.preventDefault();
  };

  // Touch events for mobile drag scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    const touch = e.touches[0];
    setStartX(touch.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    const touch = e.touches[0];
    const x = touch.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    // Only stop dragging if we're not actively dragging
    // Global listeners will handle the drag completion
  };

  const scrollLeftArrow = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -1300, behavior: "smooth" });
    }
  };

  const scrollRightArrow = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 1300, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <Container>
        <StyledContainer>
          <StyledTitleAndActions>
            <SectionTitle text={dictionary.title} image="newProduct" />
          </StyledTitleAndActions>
          <LoadingContainer>Loading featured products...</LoadingContainer>
        </StyledContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <StyledContainer>
          <StyledTitleAndActions>
            <SectionTitle text={dictionary.title} image="newProduct" />
          </StyledTitleAndActions>
          <ErrorContainer>Error loading featured products: {error}</ErrorContainer>
        </StyledContainer>
      </Container>
    );
  }

  return (
    <Container>
      <StyledContainer>
        <StyledTitleAndActions>
          <SectionTitle text={dictionary.title} image="newProduct" />
          {featuredProducts.length > 5 && (
            <StyledActions>
              <div onClick={scrollLeftArrow}>
                <ReturnIcon />
              </div>
              <div onClick={scrollRightArrow}>
                <RightSlide />
              </div>
            </StyledActions>
          )}
        </StyledTitleAndActions>
        <StyledCards
          ref={scrollContainerRef}
          $isDragging={isDragging}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <NewProductCard key={product.id} product={product} dictionary={dictionary} />
            ))
          ) : (
            <LoadingContainer>No featured products available</LoadingContainer>
          )}
        </StyledCards>
      </StyledContainer>
    </Container>
  );
};

export default NewProducts;
