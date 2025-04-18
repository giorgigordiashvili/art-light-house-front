"use client";
import styled from "styled-components";
import CardGrid from "@/components/ListProductCard/CardGrid";
const StyledComponent = styled.div`
  background: red;
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
