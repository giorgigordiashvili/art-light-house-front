import styled from "styled-components";
import Card from "./Card";
import { ProductList } from "@/api/generated/interfaces";

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

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
  return (
    <>
      <DesktopOnly>
        <GridWrapper>
          {products.map((product) => (
            <Card key={product.id} product={product} dictionary={dictionary} />
          ))}
        </GridWrapper>
      </DesktopOnly>

      <MobileOnly>
        <GridWrapper>
          {products.map((product) => (
            <Card key={product.id} product={product} dictionary={dictionary} />
          ))}
        </GridWrapper>
      </MobileOnly>
    </>
  );
};

export default CardGrid;
