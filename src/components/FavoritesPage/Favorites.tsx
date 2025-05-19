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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 117px;
  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: none;
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
        <FavoriteCard card="favorite" />
        <FavoriteCard card="favorite" />
        <FavoriteCard card="favorite" />
        <FavoriteCard card="favorite" />
      </StyledCards>
    </StyledContainer>
  );
};

export default Favorites;
