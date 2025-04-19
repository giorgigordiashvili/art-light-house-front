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

const ProductsScreen = () => {
  return (
    <StyledComponent>
      <ProductsMain />
      <Main />
    </StyledComponent>
  );
};

export default ProductsScreen;
