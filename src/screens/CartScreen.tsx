"use client";
import React from "react";
import Cart from "@/components/CartPage/Cart";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import Circle from "@/components/ui/Circle";
import LeftCircle from "@/components/ui/LeftCircle";
import NewCircle from "@/components/ui/NewCircle";
import BigCircle from "@/components/ui/BigCircle";

const StyledContainer = styled.div`
  background-color: #0b0b0b;
  padding: 186px 20px 164px 20px;
  @media (max-width: 1080px) {
    padding: 157px 0 45px 0;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  left: 40%;
  transform: translateX(-50%);
  @media (max-width: 1080px) {
    top: 240px;
  }
  @media (max-width: 505px) {
    left: 30%;
  }
  @media (max-width: 409px) {
    left: 20%;
  }
  @media (max-width: 355px) {
    left: 10%;
  }
`;

const CartScreen = () => {
  return (
    <StyledContainer>
      <BigCircle variant={2} />
      <StyledCircle>
        <Circle size="small" />
      </StyledCircle>
      <LeftCircle size="small" left="-140px" top="900px" media="yes" />
      <NewCircle size="small" right="142px" top="1000px" media="yes" />
      <Container>
        <Cart />
      </Container>
    </StyledContainer>
  );
};

export default CartScreen;
