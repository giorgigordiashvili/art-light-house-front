import React, { useRef } from "react";
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

const StyledCards = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 39px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    flex-shrink: 0;
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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
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
              <div onClick={scrollLeft}>
                <ReturnIcon />
              </div>
              <div onClick={scrollRight}>
                <RightSlide />
              </div>
            </StyledActions>
          )}
        </StyledTitleAndActions>
        <StyledCards ref={scrollContainerRef}>
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
