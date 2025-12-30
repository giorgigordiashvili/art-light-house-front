"use client";
import React, { useState, useEffect, useMemo, useTransition } from "react";
import FilterSidebar from "@/components/FilterSidebar/FilterSidebar";
import CardGrid from "@/components/ListProductCard/CardGrid";
import styled from "styled-components";
import FilterButton from "@/components/FilterSidebar/FilterButtom";
import SortDropdown from "@/components/Sort/SortDropdown";
import Container from "@/components/ui/Container";
import MobileFilterDropdown from "../FilterDropdown/MobileFilterDropdown";
import PaginationWithArrows from "@/components/PagesButton/PaginationWithArrows";
import { useFilterContext } from "@/contexts/FilterContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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
  position: relative;
  z-index: 2;
  font-family: "Helvetica";
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: #ffffff90;
  margin-top: -10px;

  @media (max-width: 1080px) {
    font-size: 16px;
    margin-top: -10px;
  }
`;

const EmptyResultsTitle = styled.h2`
  position: relative;
  margin-top: -10px;
  height: 24px;
  width: 100%;
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
  padding-top: 10px;
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
  position: relative;
  bottom: 183px;
`;

// Removed client-side skeletons; server-side navigation keeps UI responsive.

interface ProductsMainProps {
  dictionary: any;
  initialProductsData?: any;
  initialAttributes?: any[] | null;
  initialPage?: number;
}

const MIN_SKELETON_TIME = 1000; // Minimum time to show skeletons (ms)

function ProductsMain({
  dictionary,
  initialProductsData,
  initialAttributes,
  initialPage,
}: ProductsMainProps) {
  const [isMobileFilterDropdownVisible, setMobileFilterDropdownVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(true); // Start with loading state
  const { setOnFilterChange } = useFilterContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const navigationStartTime = React.useRef<number>(Date.now());
  const prevSearchParams = React.useRef<string>(searchParamsString);
  const isFirstRender = React.useRef(true);

  const products = useMemo(() => initialProductsData?.results || [], [initialProductsData]);
  const totalPages = useMemo(
    () => (initialProductsData?.count ? Math.ceil(initialProductsData.count / 12) : 1),
    [initialProductsData]
  );
  const currentPage = initialPage || 1;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const zeroResultsText = dictionary?.results?.zero ?? "0 products found";
  const countResultsTemplate = dictionary?.results?.count ?? "{count} products found";
  const resultsTitleMessage =
    products.length === 0
      ? zeroResultsText
      : countResultsTemplate.replace("{count}", products.length.toString());

  // Detect URL changes (e.g., clicking Sale link in header) and show skeletons
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // URL params changed - show loading
    if (prevSearchParams.current !== searchParamsString) {
      navigationStartTime.current = Date.now();
      setIsNavigating(true);
      prevSearchParams.current = searchParamsString;
    }
  }, [searchParamsString]);

  // Initial mount: show skeletons for minimum time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, MIN_SKELETON_TIME);

    return () => clearTimeout(timer);
  }, []);

  // Reset navigating state when new product data arrives from server
  // But respect minimum skeleton display time
  useEffect(() => {
    const elapsed = Date.now() - navigationStartTime.current;
    const remainingTime = Math.max(0, MIN_SKELETON_TIME - elapsed);

    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [initialProductsData]);

  // Register filter callback to show loading state when filters change
  useEffect(() => {
    setOnFilterChange(() => {
      navigationStartTime.current = Date.now();
      setIsNavigating(true);
    });
    return () => setOnFilterChange(null);
  }, [setOnFilterChange]);

  const toggleMobileFilterDropdown = () => {
    setMobileFilterDropdownVisible(!isMobileFilterDropdownVisible);
  };

  const handlePageChange = (page: number) => {
    navigationStartTime.current = Date.now();
    setIsNavigating(true);
    // Update URL to reflect new page; server will fetch via ISR
    const current = new URLSearchParams(window.location.search);
    current.set("page", page.toString());
    const newUrl = `${pathname}?${current.toString()}`;
    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
  };

  // Show loading state during navigation
  const isLoading = isPending || isNavigating;

  // Note: we intentionally avoid returning early on loading to keep the sidebar mounted

  return (
    <StyledComponent>
      <Container>
        <PageTitle>{dictionary.title}</PageTitle>
        {resultsTitleMessage ? (
          <ResultsTitle>{resultsTitleMessage}</ResultsTitle>
        ) : (
          <EmptyResultsTitle />
        )}
        <SortWrapper>
          <OnMobile>
            <FilterButton onClick={toggleMobileFilterDropdown} dictionary={dictionary} />
          </OnMobile>
          <SortDropdown dictionary={dictionary} />
        </SortWrapper>
        <ContentWrapper>
          <OnDesktop>
            <FilterSidebar dictionary={dictionary.filter} initialAttributes={initialAttributes} />
          </OnDesktop>
          <div style={{ width: "100%" }}>
            <>
              <CardGrid products={products} dictionary={dictionary} loading={isLoading} />
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
            </>
          </div>
        </ContentWrapper>

        {isMobileFilterDropdownVisible && (
          <MobileFilterDropdown
            onClose={toggleMobileFilterDropdown}
            dictionary={dictionary}
            initialAttributes={initialAttributes}
          />
        )}
      </Container>
    </StyledComponent>
  );
}

export default ProductsMain;
