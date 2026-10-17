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

interface CardGridProps {
  products: ProductList[];
  dictionary: any;
  loading?: boolean;
}

const CardGrid = ({ products, dictionary, loading = false }: CardGridProps) => {
  const CARDS_PER_PAGE = 12;

  // Create skeleton items for loading state
  const createSkeletonItems = (count: number) => {
    return Array.from({ length: count }, (_, i) => <SkeletonCard key={`skeleton-${i}`} />);
  };

  // Create an array of exactly 12 items: real products + placeholders
  // Only first 4 images get priority (above the fold)
  const createGridItems = (cardsPerPage: number = CARDS_PER_PAGE) => {
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
    return <GridWrapper>{createSkeletonItems(CARDS_PER_PAGE)}</GridWrapper>;
  }

  return (
    <GridWrapper>
      {products.length === 0 && (
        <EmptyMessage>{dictionary?.results?.emptyMessage || "No products found"}</EmptyMessage>
      )}
      {createGridItems(CARDS_PER_PAGE)}
    </GridWrapper>
  );
};

export default CardGrid;
