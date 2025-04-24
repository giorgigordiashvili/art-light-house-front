"use client";
import styled from "styled-components";
import MainPage from "@/components/HeroSection/MainPage";

const StyledComponent = styled.div`
  background: #0b0b0b;
  min-height: 100dvh;
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
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
