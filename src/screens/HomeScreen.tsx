"use client";
import styled from "styled-components";
import HeroAndCategory from "@/components/HeroSection/HeroAndCategory";

const StyledComponent = styled.div`
  background: red;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const HomeScreen = () => {
  return (
    <StyledComponent>
      <HeroAndCategory></HeroAndCategory>
    </StyledComponent>
  );
};

export default HomeScreen;
