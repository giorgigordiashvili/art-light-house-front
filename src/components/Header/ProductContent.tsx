import React from "react";
import styled from "styled-components";
import ProductImage from "./ProductImage";
import ProductTitle from "./ProductTitle";
import ProductPrice from "./ProductPrice";

const StyledContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 15px 0 0 15px;
  @media (max-width: 1080px) {
    height: 116px;
  }
`;

const StyledTextContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  @media (max-width: 1080px) {
    justify-content: flex-start;
    margin-top: 6px;
  }
`;

const ProductContent = ({ dictionary }: any) => {
  return (
    <StyledContainer>
      <ProductImage />
      <StyledTextContent>
        <ProductTitle text={dictionary?.cart?.cartModal.cardTitle1} />
        <ProductPrice text={dictionary?.cart?.cartModal.price} />
      </StyledTextContent>
    </StyledContainer>
  );
};

export default ProductContent;
