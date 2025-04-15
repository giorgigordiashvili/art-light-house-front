"use client";
import styled from "styled-components";
import Header from "../components/Header";

const StyledComponent = styled.div`
  background: red;
  height: 1920px;
`;

function HomeScreen() {
  return (
    <>
      <StyledComponent>
        <Header />
      </StyledComponent>
    </>
  );
}

export default HomeScreen;
