import styled from "styled-components";
import Card from "./Card";
import PlaceholderCard from "./PlaceholderCard";
import { ProductList } from "@/api/generated/interfaces";

const GridWrapper = styled.div`
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

const CardGrid = ({ products, dictionary }: { products: ProductList[]; dictionary: any }) => {
  const CARDS_PER_PAGE_DESKTOP = 12;
  const CARDS_PER_PAGE_MOBILE = 12; // Keep consistent across mobile and desktop

  // Create an array of exactly 12 items: real products + placeholders
  const createGridItems = (cardsPerPage: number = CARDS_PER_PAGE_DESKTOP) => {
    const items = [];

    // Add real products
    for (let i = 0; i < Math.min(products.length, cardsPerPage); i++) {
      items.push(<Card key={products[i].id} product={products[i]} dictionary={dictionary} />);
    }

    // Fill remaining slots with placeholders
    for (let i = products.length; i < cardsPerPage; i++) {
      items.push(<PlaceholderCard key={`placeholder-${i}`} />);
    }

    return items;
  };

  return (
    <>
      <DesktopOnly>
        <GridWrapper>{createGridItems(CARDS_PER_PAGE_DESKTOP)}</GridWrapper>
      </DesktopOnly>

      <MobileOnly>
        <GridWrapper>{createGridItems(CARDS_PER_PAGE_MOBILE)}</GridWrapper>
      </MobileOnly>
    </>
  );
};

export default CardGrid;
