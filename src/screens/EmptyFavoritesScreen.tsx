import React from "react";
import styled from "styled-components";
import Favorites from "@/components/Favorites/Favorites";

const StyledContainer = styled.div`
  background-color: #0b0b0b;
`;

const EmptyFavoritesScreen = () => {
  return (
    <StyledContainer>
      <Favorites />
    </StyledContainer>
  );
};

export default EmptyFavoritesScreen;
