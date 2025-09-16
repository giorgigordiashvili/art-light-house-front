"use client";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import MenuBar from "./MenuBar";
import BigCard from "./BigCard";
import DetailDescription from "./DetailDescription";
import BuyButton from "./BuyButton";
import AddToCartButton from "./AddToCartButton";
import Image from "next/image";
import Card from "../ListProductCard/Card";
import LeftCircle from "../ui/LeftCircle";
import NewCircle from "../ui/NewCircle";
import Circle from "../ui/Circle";

const StyledComponent = styled.div`
  background: black;
  margin-top: 80px;

  @media (max-width: 1080px) {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  bottom: -750px;
  left: 37%;
  transform: translateX(-50%);
  @media (max-width: 1080px) {
    display: none;
  }
`;

const FlexRow = styled.div`
  display: grid;
  grid-template-columns: 636px 563px;
  gap: 44px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  @media (max-width: 1080px) {
    align-items: center;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 21px;

  @media (max-width: 1080px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

const ProductHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 100px;
  color: #ffffff;

  p {
    font-family: Helvetica;
    font-weight: 250;
    font-size: 34px;
    line-height: 24px;
    letter-spacing: 0%;
    @media (max-width: 1080px) {
      font-size: 24px;
    }
  }
`;
const CardGrid = styled.div`
  margin-top: 39px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-content: center;
  margin-bottom: 538px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(auto-fill, minmax(170px, 2fr));
    gap: 10px;
    justify-items: center;
  }

  @media (max-width: 569px) {
    max-width: 350px;
    justify-content: center;
    justify-items: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

import { Product } from "@/lib/productService";
import { useSimilarProducts } from "@/hooks/useSimilarProducts";

function DetailMain({ dictionary, product }: { dictionary: any; product: Product | null }) {
  const { similar, loading, error } = useSimilarProducts({ product, limit: 4 });
  return (
    <StyledComponent>
      <NewCircle size="small" right="142px" top="1000px" media="yes" />
      <LeftCircle size="small" left="-180px" top="900px" media="yes" />
      <StyledCircle>
        <Circle size="large" />
      </StyledCircle>
      <Container>
        <MenuBar dictionary={dictionary} />
        <FlexRow>
          <BigCard />
          <RightColumn>
            <DetailDescription dictionary={dictionary} product={product} />
            <ButtonRow>
              <BuyButton dictionary={dictionary} />
              <AddToCartButton dictionary={dictionary} />
            </ButtonRow>
          </RightColumn>
        </FlexRow>

        <ProductHeader>
          <Image
            src="/assets/icons/notification-text.svg"
            alt={dictionary?.productDetails?.similarProducts || "Similar Products"}
            width={32}
            height={32}
            style={{ borderRadius: 8, objectFit: "cover" }}
          />
          <p>{dictionary?.productDetails?.similarProducts || "Similar Products"}</p>
        </ProductHeader>
        <CardGrid>
          {loading && <p style={{ color: "white" }}>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && similar.length === 0 && (
            <p style={{ color: "white" }}>No similar products found.</p>
          )}
          {similar.map((p) => (
            <Card key={p.id} dictionary={dictionary.productDetails} product={p} />
          ))}
        </CardGrid>
      </Container>
    </StyledComponent>
  );
}

export default DetailMain;
