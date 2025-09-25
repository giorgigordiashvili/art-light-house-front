"use client";
import React, { useState, useEffect } from "react";
import FilterSidebar from "@/components/FilterSidebar/FilterSidebar";
import CardGrid from "@/components/ListProductCard/CardGrid";
import styled from "styled-components";
import FilterButton from "@/components/FilterSidebar/FilterButtom";
import SortDropdown from "@/components/Sort/SortDropdown";
import Container from "@/components/ui/Container";
import MobileFilterDropdown from "../FilterDropdown/MobileFilterDropdown";
import PaginationWithArrows from "@/components/PagesButton/PaginationWithArrows";
import { useProducts } from "@/hooks/useProducts";
import { useFilterContext } from "@/contexts/FilterContext";

const StyledComponent = styled.div`
  background: black;
  height: auto;
  display: flex;
  align-items: center;
`;

const PageTitle = styled.h1`
  position: relative;
  z-index: 2;
  font-family: "Helvetica";
  font-weight: 250;
  font-size: 64px;
  line-height: 33.8px;
  color: white;
  margin-top: 167px;
  margin-bottom: 30px;

  @media (max-width: 1080px) {
    font-size: 34px;
    line-height: 24px;
    margin-bottom: 47px;
  }
`;

const ResultsTitle = styled.h2`
  position: sticky;
  z-index: 2;
  font-family: "Helvetica";
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: #ffffff90;

  @media (max-width: 1080px) {
    font-size: 16px;
    margin-top: -10px;
    margin-bottom: 32px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
`;

const SortWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 18px;
  @media (max-width: 1080px) {
    justify-content: space-between;
  }
`;

const OnMobile = styled.div`
  display: none;
  z-index: 2;

  @media (max-width: 1080px) {
    display: block;
  }
`;

const OnDesktop = styled.div`
  @media (max-width: 1080px) {
    display: none;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 70px;
`;

function ProductsMain({ dictionary }: any) {
  const [isMobileFilterDropdownVisible, setMobileFilterDropdownVisible] = useState(false);
  const { setOnFilterChange } = useFilterContext();

  // Fetch products without automatic filtering - filtering is manual now
  const {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    fetchPage,
    applyFilters,
  } = useProducts();

  const isReady = !loading && !error;
  const zeroResultsText = dictionary?.results?.zero ?? "0 products found";
  const countResultsTemplate = dictionary?.results?.count ?? "{count} products found";
  const resultsTitleMessage = isReady
    ? products.length === 0
      ? zeroResultsText
      : countResultsTemplate.replace("{count}", products.length.toString())
    : null;

  // Register immediate filter callback
  useEffect(() => {
    const handleImmediateFilter = async (filters: any) => {
      await applyFilters({
        categoryIds: filters.selectedCategoryIds,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        attributes: filters.selectedAttributes,
      });
    };

    setOnFilterChange(handleImmediateFilter);

    // Cleanup on unmount
    return () => {
      setOnFilterChange(null);
    };
  }, [applyFilters, setOnFilterChange]);

  const toggleMobileFilterDropdown = () => {
    setMobileFilterDropdownVisible(!isMobileFilterDropdownVisible);
  };

  const handlePageChange = async (page: number) => {
    await fetchPage(page);
  };

  if (loading) {
    return (
      <StyledComponent>
        <Container>
          <PageTitle>{dictionary.title}</PageTitle>
          <div
            style={{
              color: "#ffffff",
              textAlign: "center",
              padding: "40px",
              fontSize: "16px",
            }}
          >
            Loading products...
          </div>
        </Container>
      </StyledComponent>
    );
  }

  if (error) {
    return (
      <StyledComponent>
        <Container>
          <PageTitle>{dictionary.title}</PageTitle>
          <div
            style={{
              color: "#ff4444",
              textAlign: "center",
              padding: "40px",
              fontSize: "16px",
            }}
          >
            Error loading products: {error}
          </div>
        </Container>
      </StyledComponent>
    );
  }

  return (
    <StyledComponent>
      <Container>
        <PageTitle>{dictionary.title}</PageTitle>
        {resultsTitleMessage && <ResultsTitle>{resultsTitleMessage}</ResultsTitle>}
        <SortWrapper>
          <OnMobile>
            <FilterButton onClick={toggleMobileFilterDropdown} dictionary={dictionary} />
          </OnMobile>
          <SortDropdown dictionary={dictionary} />
        </SortWrapper>
        <ContentWrapper>
          <OnDesktop>
            <FilterSidebar dictionary={dictionary.filter} />
          </OnDesktop>
          <div style={{ width: "100%" }}>
            <CardGrid products={products} dictionary={dictionary} />

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationWrapper>
                <PaginationWithArrows
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                />
              </PaginationWrapper>
            )}
          </div>
        </ContentWrapper>

        {isMobileFilterDropdownVisible && (
          <MobileFilterDropdown onClose={toggleMobileFilterDropdown} dictionary={dictionary} />
        )}
      </Container>
    </StyledComponent>
  );
}

export default ProductsMain;
