"use client";
import React from "react";
import styled from "styled-components";
import PaginationWithArrows from "@/components/PagesButton/PaginationWithArrows";

const MainContainer = styled.div`
  margin-top: 70px;
  margin-bottom: 183px;
  @media (max-width: 1080px) {
    margin-top: 64px;
    margin-bottom: 129px;
  }
`;

const Main = () => {
  return (
    <MainContainer>
      <PaginationWithArrows />
    </MainContainer>
  );
};

export default Main;
