"use client";
import styled from "styled-components";
import DetailMain from "@/components/ProductDetail/DetailMain";
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProductDetailScreen = () => {
  return (
    <StyledComponent>
      <BigCircle variant={2} />
      <DetailMain></DetailMain>
    </StyledComponent>
  );
};

export default ProductDetailScreen;
