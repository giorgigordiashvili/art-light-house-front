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
  width: 284px;
  height: 284px;
  opacity: 0.64;
  position: absolute;
  top: 820px;
  right: 0;
  background: radial-gradient(
    circle,
    rgba(255, 203, 64, 0.44) 0%,
    rgba(255, 203, 64, 0.1) 80%,
    rgba(255, 203, 64, 0) 100%
  );
  filter: blur(100px);
  border-radius: 50%;
  z-index: 1;
  @media (max-width: 1080px) {
    display: none;
  }
`;

const StyledSecondCircle = styled.div`
  width: 284px;
  height: 284px;
  opacity: 0.64;
  position: absolute;
  top: 750px;
  left: 0;
  background: radial-gradient(
    circle,
    rgba(255, 203, 64, 0.44) 0%,
    rgba(255, 203, 64, 0.1) 80%,
    rgba(255, 203, 64, 0) 100%
  );
  filter: blur(100px);
  border-radius: 50%;
  z-index: 1;
  @media (max-width: 1080px) {
    display: none;
  }
`;

const StyledBottomCircle = styled.div`
  width: 372px;
  height: 372px;
  opacity: 0.64;
  position: absolute;
  bottom: -1140px;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(
    circle,
    rgba(255, 203, 64, 0.44) 0%,
    rgba(255, 203, 64, 0.1) 80%,
    rgba(255, 203, 64, 0) 100%
  );
  filter: blur(100px);
  border-radius: 50%;
  z-index: 1;
  @media (max-width: 1080px) {
    bottom: -1300px;
    right: 0;
    transform: none;
    left: auto;
    width: 328px;
    height: 328px;
    background: radial-gradient(
      circle,
      rgba(255, 203, 64, 0.18) 0%,
      rgba(255, 203, 64, 0.1) 80%,
      rgba(255, 203, 64, 0) 100%
    );
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
    font-family: Helvetica Neue LT GEO;
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

function ProductsMain() {
  return (
    <StyledComponent>
      <StyledCircle />
      <StyledSecondCircle />
      <StyledBottomCircle />
      <Container>
        <MenuBar />
        <FlexRow>
          <BigCard />
          <RightColumn>
            <DetailDescription />
            <ButtonRow>
              <BuyButton />
              <AddToCartButton />
            </ButtonRow>
          </RightColumn>
        </FlexRow>

        <ProductHeader>
          <Image
            src="/assets/icons/notification-text.svg"
            alt="Product"
            width={32}
            height={32}
            style={{ borderRadius: 8, objectFit: "cover" }}
          />
          <p>მსგავსი პროდუქტები</p>
        </ProductHeader>
        <CardGrid>
          <Card />
          <Card />
          <Card />
          <Card />
        </CardGrid>
      </Container>
    </StyledComponent>
  );
}

export default ProductsMain;
