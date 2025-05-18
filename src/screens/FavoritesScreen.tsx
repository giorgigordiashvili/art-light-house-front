"use client";
import React from "react";
import Favorites from "@/components/FavoritesPage/Favorites";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import Circle from "@/components/ui/Circle";
import NewCircle from "@/components/ui/NewCircle";
import LeftCircle from "@/components/ui/LeftCircle";
import BigCircle from "@/components/ui/BigCircle";

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

const StyledCircle = styled.div`
  position: absolute;
  left: 40%;
  transform: translateX(-50%);
  @media (max-width: 1080px) {
    top: 240px;
  }
  @media (max-width: 505px) {
    left: 30%;
  }
  @media (max-width: 409px) {
    left: 20%;
  }
  @media (max-width: 355px) {
    left: 10%;
  }
`;

const FavoritesScreen = () => {
  return (
    <StyledContainer>
      <BigCircle variant={2} />
      <StyledCircle>
        <Circle size="small" />
      </StyledCircle>
      <LeftCircle size="small" left="-140px" top="900px" media="yes" />
      <NewCircle size="small" right="142px" top="1000px" media="yes" />
      <Container>
        <Favorites />
      </Container>
    </StyledContainer>
  );
};

export default FavoritesScreen;
