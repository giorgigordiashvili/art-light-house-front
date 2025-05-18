import React from "react";
import ContactTitle from "../Contact/ContactTitle";
import styled from "styled-components";
import Container from "../ui/Container";
import EmptyFavoritesCard from "./EmptyFavoritesCard";

const StyledContainer = styled.div`
  padding: 188px 20px 132px 20px;
  @media (max-width: 1080px) {
    padding: 157px 0 222px 0;
  }
`;

const Favorites = () => {
  return (
    <Container>
      <StyledContainer>
        <ContactTitle text="ჩემი პროდუქტები" />
        <EmptyFavoritesCard />
      </StyledContainer>
    </Container>
  );
};

export default Favorites;
