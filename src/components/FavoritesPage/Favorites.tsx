import React from "react";
import ContactTitle from "../Contact/ContactTitle";
import FavoriteCard from "./FavoriteCard";
import styled from "styled-components";

const StyledContainer = styled.div`
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }

  @media (max-width: 1080px) {
    padding-inline: 0;
  }
`;

const StyledTitle = styled.div``;

const StyledCards = styled.div`
  width: 800px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 117px;
  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const Favorites = () => {
  return (
    <StyledContainer>
      <StyledTitle>
        <ContactTitle text="შენახული პროდუქტები" />
      </StyledTitle>
      <StyledCards>
        <FavoriteCard card="favorite" />
        <FavoriteCard card="favorite" />
        <FavoriteCard card="favorite" />
      </StyledCards>
    </StyledContainer>
  );
};

export default Favorites;
