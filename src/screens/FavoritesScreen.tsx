"use client";
import React from "react";
import Favorites from "@/components/FavoritesPage/Favorites";
import styled from "styled-components";
import Container from "@/components/ui/Container";

const StyledContainer = styled.div`
  background-color: #000;
  padding-bottom: 118px;
  padding-top: 186px;
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
