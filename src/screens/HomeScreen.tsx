"use client";
import styled from "styled-components";
// import AddButton from "@/components/ListProductCard/AddButton";
// import StyledSaveButton from "@/components/ListProductCard/SaveButton";
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
      {/* <AddButton />
      <StyledSaveButton /> */}
      <CardGrid></CardGrid>
    </StyledComponent>
  );
}

export default HomeScreen;
