import styled from "styled-components";
import Card from "./Card";
import PlaceholderCard from "./PlaceholderCard";
import SkeletonCard from "./SkeletonCard";
import { ProductList } from "@/api/generated/interfaces";

const GridWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 304px;
  justify-items: center;

  @media (max-width: 1332px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const EmptyMessage = styled.div`
  position: absolute;
  top: 50px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 32px;
  line-height: 24px;
  pointer-events: none;
`;

const DesktopOnly = styled.div`
  display: block;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 1080px) {
    display: block;
  }
`;

interface CardGridProps {
  products: ProductList[];
  dictionary: any;
  loading?: boolean;
}

const CardGrid = ({ products, dictionary, loading = false }: CardGridProps) => {
  const CARDS_PER_PAGE_DESKTOP = 12;
  const CARDS_PER_PAGE_MOBILE = 12;

  // Create skeleton items for loading state
  const createSkeletonItems = (count: number) => {
    return Array.from({ length: count }, (_, i) => <SkeletonCard key={`skeleton-${i}`} />);
  };

  // Create an array of exactly 12 items: real products + placeholders
  // Only first 4 images get priority (above the fold)
  const createGridItems = (cardsPerPage: number = CARDS_PER_PAGE_DESKTOP) => {
    const items = [];

    // Add real products - only first 4 get priority for faster LCP
    for (let i = 0; i < Math.min(products.length, cardsPerPage); i++) {
      items.push(
        <Card key={products[i].id} product={products[i]} dictionary={dictionary} priority={i < 4} />
      );
    }

    // Fill remaining slots with placeholders
    for (let i = products.length; i < cardsPerPage; i++) {
      items.push(<PlaceholderCard key={`placeholder-${i}`} />);
    }

    return items;
  };

  if (loading) {
    return (
      <>
        <DesktopOnly>
          <GridWrapper>{createSkeletonItems(CARDS_PER_PAGE_DESKTOP)}</GridWrapper>
        </DesktopOnly>
        <MobileOnly>
          <GridWrapper>{createSkeletonItems(CARDS_PER_PAGE_MOBILE)}</GridWrapper>
        </MobileOnly>
      </>
    );
  }

  return (
    <>
      <DesktopOnly>
        <GridWrapper>
          {products.length === 0 && (
            <EmptyMessage>{dictionary?.results?.emptyMessage || "No products found"}</EmptyMessage>
          )}
          {createGridItems(CARDS_PER_PAGE_DESKTOP)}
        </GridWrapper>
      </DesktopOnly>

      <MobileOnly>
        <GridWrapper>
          {products.length === 0 && (
            <EmptyMessage>{dictionary?.results?.emptyMessage || "No products found"}</EmptyMessage>
          )}
          {createGridItems(CARDS_PER_PAGE_MOBILE)}
        </GridWrapper>
      </MobileOnly>
    </>
  );
};

export default CardGrid;
