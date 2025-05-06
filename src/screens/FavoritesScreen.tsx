"use client";
import React from "react";
import Favorites from "@/components/FavoritesPage/Favorites";
import styled from "styled-components";
import Container from "@/components/ui/Container";

const StyledContainer = styled.div`
  background-color: #0b0b0b;
  padding-bottom: 118px;
  padding-top: 186px;
  padding-inline: 20px;
  padding: 186px 20px 118px 20px;
  @media (max-width: 1080px) {
    padding: 157px 0 45px 0;
  }
`;

const FavoritesScreen = () => {
  return (
    <StyledContainer>
      <Container>
        <Favorites />
      </Container>
    </StyledContainer>
  );
};

export default FavoritesScreen;
