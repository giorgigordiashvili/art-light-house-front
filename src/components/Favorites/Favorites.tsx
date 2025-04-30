import React from "react";
import ContactTitle from "../Contact/ContactTitle";
import styled from "styled-components";
import Container from "../ui/Container";
import EmptyFavoritesCard from "./EmptyFavoritesCard";

const StyledContainer = styled.div`
  padding: 188px 0 132px 0;
  padding-inline: 20px;
  @media (max-width: 1080px) {
    padding-inline: 0;
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
