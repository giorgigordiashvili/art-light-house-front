import React from "react";
import ContactTitle from "../Contact/ContactTitle";
import FavoriteCard from "./FavoriteCard";
import styled from "styled-components";

const StyledContainer = styled.div``;

const StyledTitle = styled.div``;

const StyledCards = styled.div`
  max-height: 508px;
  overflow: scroll;
  scrollbar-width: none;
  width: 800px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 117px;
  @media (max-width: 1080px) {
    width: 100%;
    max-height: 258px;
    gap: 10px;
    margin-top: 48px;
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
        <FavoriteCard card="favorite" />
      </StyledCards>
    </StyledContainer>
  );
};

export default Favorites;
