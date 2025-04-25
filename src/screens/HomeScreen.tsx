"use client";
import styled from "styled-components";
import MainPage from "@/components/MainPage/MainPage";

const StyledComponent = styled.div`
  background: #0b0b0b;
  min-height: 100dvh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const HomeScreen = () => {
  return (
    <StyledComponent>
      <MainPage />
    </StyledComponent>
  );
};

export default HomeScreen;
