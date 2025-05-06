"use client";
import React from "react";
import Cart from "@/components/CartPage/Cart";
import styled from "styled-components";
import Container from "@/components/ui/Container";

const StyledContainer = styled.div`
  background-color: #0b0b0b;
  padding: 186px 20px 164px 20px;
  @media (max-width: 1080px) {
    padding: 157px 0 45px 0;
  }
`;

const CartScreen = () => {
  return (
    <StyledContainer>
      <Container>
        <Cart />
      </Container>
    </StyledContainer>
  );
};

export default CartScreen;
