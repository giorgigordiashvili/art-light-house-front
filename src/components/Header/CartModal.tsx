import React from "react";
import styled from "styled-components";
import CartProduct from "./CartProduct";

const StyledContainer = styled.div`
  width: 349px;
  height: 415px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 99px;
  background-color: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  padding: 0;
  z-index: 1001;

  @media (max-width: 1332px) {
    right: 20px;
  }
`;

const StyledSpanContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-top: 20px;
  padding-left: 20px;
`;

const StyledSpan = styled.span`
  color: #fff;
  display: flex;
`;

const ModalLayoutWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const ModalLayout = styled.div`
  width: 1292px;
  display: flex;
  justify-content: flex-end;
`;

const ProductList = styled.div`
  margin-top: 19px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 246px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: red;
    border-radius: 0;
    min-height: 99px;
  }

  &::-webkit-scrollbar-button {
    display: none;
    height: 0;
    width: 0;
  }

  scrollbar-width: thin;
  scrollbar-color: #454545 transparent;
`;

const ProductWrapper = styled.div`
  height: 120px;
  flex-shrink: 0;
`;

const CartModal = ({ itemCount }: { itemCount: number }) => {
  return (
    <ModalLayoutWrapper>
      <ModalLayout>
        <StyledContainer>
          <StyledSpanContainer>
            <StyledSpan>{itemCount} პროდუქტები</StyledSpan>
          </StyledSpanContainer>
          <ProductList>
            {Array.from({ length: itemCount }).map((_, index) => (
              <ProductWrapper key={index}>
                <CartProduct />
              </ProductWrapper>
            ))}
          </ProductList>
        </StyledContainer>
      </ModalLayout>
    </ModalLayoutWrapper>
  );
};

export default CartModal;
