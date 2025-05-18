"use client";
import React from "react";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import Checkout from "@/components/Checkout/CheckoutMain";

const StyledContainer = styled.div`
  padding-top: 186px;
  padding-bottom: 143px;
  background-color: #0b0b0b;
  @media (max-width: 1080px) {
    padding-top: 157px;
    padding-bottom: 68px;
  }
`;

const StyledCheckout = styled.div``;

const CheckoutScreen = () => {
  return (
    <StyledContainer>
      <Container>
        <StyledCheckout>
          <Checkout />
        </StyledCheckout>
      </Container>
    </StyledContainer>
  );
};

export default CheckoutScreen;
