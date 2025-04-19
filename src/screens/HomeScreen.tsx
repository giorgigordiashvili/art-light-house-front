"use client";
import ProductsScreen from "./ProductsScreen";
import styled from "styled-components";
const StyledComponent = styled.div`
  background: red;
  height: 1920px;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HomeScreen = () => {
  return (
    <StyledComponent>
      <ProductsScreen></ProductsScreen>
    </StyledComponent>
  );
};

export default HomeScreen;
