import React from "react";
import styled from "styled-components";
import TrashIcon from "./TrashIcon";
import QuantitySelector from "./QuantitySelector";
import ProductContent from "./ProductContent";

const StyledContainer = styled.div`
  width: 325px;
  height: 116px;
  border-radius: 17px;
  background-color: #1a1a1a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const StyledTrashButton = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
`;

const CartProduct = () => {
  return (
    <StyledContainer>
      <StyledTrashButton>
        <TrashIcon />
      </StyledTrashButton>
      <ProductContent />
      <QuantitySelector />
    </StyledContainer>
  );
};

export default CartProduct;
