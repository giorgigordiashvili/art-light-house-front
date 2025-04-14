"use client";
import styled from "styled-components";
import Header from "../components/Header";

const StyledComponent = styled.div`
  background: red;
  height: 200px;
`;

type Props = {};

function HomeScreen({}: Props) {
  return (
    <>
      <StyledComponent>
        <Header />
      </StyledComponent>
    </>
  );
}

export default HomeScreen;
