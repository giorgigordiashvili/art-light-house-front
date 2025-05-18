import React from "react";
import ContactTitle from "../Contact/ContactTitle";
import styled from "styled-components";
import EmptyCartCard from "./EmptyCartCard";
import Container from "../ui/Container";

const StyledContainer = styled.div`
  padding: 188px 20px 132px 20px;
  z-index: 1;
  @media (max-width: 1080px) {
    padding: 157px 0 222px 0;
  }
`;

const Cart = () => {
  return (
    <Container>
      <StyledContainer>
        <ContactTitle text="ჩემი პროდუქტები" />
        <EmptyCartCard />
      </StyledContainer>
    </Container>
  );
};

export default Cart;
