import React from "react";
import styled from "styled-components";
import Card from "./Card";

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 24px;
  padding: 20px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 16px;
  }
`;

const CardGrid = () => {
  return (
    <GridWrapper>
      {Array.from({ length: 11 }).map((_, i) => (
        <Card key={i} />
      ))}
    </GridWrapper>
  );
};

export default CardGrid;
