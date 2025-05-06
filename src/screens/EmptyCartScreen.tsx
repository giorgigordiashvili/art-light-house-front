"use client";
import React from "react";
import styled from "styled-components";
import Cart from "@/components/Cart/Cart";

const StyledContainer = styled.div`
  background-color: black;
`;

const EmptyCartScreen = () => {
  return (
    <StyledContainer>
      <Cart />
    </StyledContainer>
  );
};

export default EmptyCartScreen;
