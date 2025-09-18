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
  // Demo pagination props
  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
  };

  return (
    <MainContainer>
      <PaginationWithArrows
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    </MainContainer>
  );
};

export default Main;
