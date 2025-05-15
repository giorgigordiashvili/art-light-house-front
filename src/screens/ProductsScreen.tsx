"use client";
import ProductsMain from "@/components/ListProductCard/ProductsMain";
import Main from "@/components/PagesButton/Main";
import styled from "styled-components";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledCircle = styled.div`
  width: 284px;
  height: 284px;
  background-color: red;
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
  width: 372px;
  height: 372px;
  opacity: 0.64;
  bottom: -1500px;
  position: absolute;
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

const ProductsScreen = () => {
  return (
    <StyledComponent>
      <ProductsMain />
      <Main />
      <StyledCircle />
      <StyledSecondCircle />
    </StyledComponent>
  );
};

export default ProductsScreen;
