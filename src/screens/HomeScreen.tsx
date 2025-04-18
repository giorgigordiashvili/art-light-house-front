"use client";
import styled from "styled-components";
import ProductsMain from "@/components/ListProductCard/ProductsMain";
import Main from "@/components/PagesButton/Main";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HomeScreen = () => {
  return (
    <StyledComponent>
      <ProductsMain />
      <Main />
    </StyledComponent>
  );
};

export default HomeScreen;
