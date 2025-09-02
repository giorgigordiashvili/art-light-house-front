import styled from "styled-components";
import Card from "./Card";
import { useProducts } from "@/hooks/useProducts";

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

const CardGrid = ({ dictionary }: any) => {
  // Products auto-refetch when language changes via TranslationProvider
  const { products, isLoading, error } = useProducts();

  const content = () => {
    if (isLoading) return <p style={{ color: "white" }}>Loading products...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!products.length) return <p style={{ color: "white" }}>No products found.</p>;
    return products.map((p) => <Card key={p.id} dictionary={dictionary} product={p} />);
  };

  return (
    <>
      <DesktopOnly>
        <GridWrapper>{content()}</GridWrapper>
      </DesktopOnly>
      <MobileOnly>
        <GridWrapper>{content()}</GridWrapper>
      </MobileOnly>
    </>
  );
};

export default CardGrid;
