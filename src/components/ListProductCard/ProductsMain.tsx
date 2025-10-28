"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { useRouter, usePathname } from "next/navigation";

const StyledComponent = styled.div`
  background: #0b0b0b;
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
  position: absolute;
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

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 253px;
  justify-items: center;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const SkeletonCard = styled.div`
  width: 308px;
  height: 417px;
  border-radius: 17px;
  border: 1px solid #ffffff12;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  position: relative;
  overflow: hidden;

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
    z-index: 1;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @media (max-width: 1080px) {
    width: 170px;
    height: 275px;
  }
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 280px;
  background: rgba(255, 255, 255, 0.05);

  @media (max-width: 1080px) {
    height: 180px;
  }
`;

const SkeletonContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 1080px) {
    padding: 12px;
    gap: 8px;
  }
`;

const SkeletonTitle = styled.div`
  width: 70%;
  height: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;

  @media (max-width: 1080px) {
    height: 14px;
  }
`;

const SkeletonPrice = styled.div`
  width: 50%;
  height: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-top: 8px;

  @media (max-width: 1080px) {
    height: 16px;
    margin-top: 4px;
  }
`;

function ProductsMain({ dictionary }: any) {
  const [isMobileFilterDropdownVisible, setMobileFilterDropdownVisible] = useState(false);
  const { setOnFilterChange, filters, isInitialized } = useFilterContext();
  const router = useRouter();
  const pathname = usePathname();
  const hasAppliedInitialFilters = useRef(false);

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
  } = useProducts({ skipInitialFetch: true }); // Skip initial fetch to wait for URL filters

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
      // Reset to page 1 when filters change
      await applyFilters({
        categoryIds: filters.selectedCategoryIds,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        attributes: filters.selectedAttributes,
        ordering: filters.ordering,
      });
    };

    setOnFilterChange(handleImmediateFilter);

    // Cleanup on unmount
    return () => {
      setOnFilterChange(null);
    };
  }, [applyFilters, setOnFilterChange]);

  // Apply initial filters from URL when ready, or fetch products if no filters
  useEffect(() => {
    if (!isInitialized || hasAppliedInitialFilters.current) return;

    const hasFilters =
      filters.selectedCategoryIds.length > 0 ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.selectedAttributes ||
      filters.ordering;

    if (hasFilters) {
      // Apply URL filters
      applyFilters({
        categoryIds: filters.selectedCategoryIds,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        attributes: filters.selectedAttributes,
        ordering: filters.ordering,
      });
    } else {
      // No filters from URL, fetch all products
      applyFilters({});
    }

    hasAppliedInitialFilters.current = true;
  }, [isInitialized, filters, applyFilters]);

  // Handle page synchronization from URL (initial load and pagination changes)
  useEffect(() => {
    if (!isInitialized) return;

    // Use direct URL parsing to avoid SSR issues with useSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = urlParams.get("page") ? parseInt(urlParams.get("page")!, 10) : 1;

    // Sync page if URL page differs from current page state
    if (pageFromUrl !== currentPage) {
      fetchPage(pageFromUrl);
    }
  }, [isInitialized, currentPage, fetchPage]);
  const toggleMobileFilterDropdown = () => {
    setMobileFilterDropdownVisible(!isMobileFilterDropdownVisible);
  };

  const handlePageChange = async (page: number) => {
    // Update URL first to ensure state consistency
    const current = new URLSearchParams(window.location.search);
    current.set("page", page.toString());
    const newUrl = `${pathname}?${current.toString()}`;
    router.replace(newUrl, { scroll: false });

    // Then fetch the page data
    await fetchPage(page);
  };

  if (loading) {
    return (
      <StyledComponent>
        <Container>
          <PageTitle>{dictionary.title}</PageTitle>
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
              <SkeletonGrid>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
                  <SkeletonCard key={index}>
                    <SkeletonImage />
                    <SkeletonContent>
                      <SkeletonTitle />
                      <SkeletonPrice />
                    </SkeletonContent>
                  </SkeletonCard>
                ))}
              </SkeletonGrid>
            </div>
          </ContentWrapper>
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
