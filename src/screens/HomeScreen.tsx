"use client";
import styled from "styled-components";
import ProductsMain from "@/components/ListProductCard/ProductsMain";
const StyledComponent = styled.div`
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function HomeScreen() {
  return (
    <StyledComponent>
      <ProductsMain />={" "}
    </StyledComponent>
  );
}

export default HomeScreen;
