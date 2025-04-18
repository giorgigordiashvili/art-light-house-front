"use client";
import CardGrid from "@/components/ListProductCard/CardGrid";
import styled from "styled-components";
const StyledComponent = styled.div`
  background: #000;
  height: 1920px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function HomeScreen() {
  return (
    <StyledComponent>
      <CardGrid></CardGrid>
    </StyledComponent>
  );
}

export default HomeScreen;
