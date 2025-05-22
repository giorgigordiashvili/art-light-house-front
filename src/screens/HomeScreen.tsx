"use client";
import styled from "styled-components";
import MainPage from "@/components/MainPage/MainPage";
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: #0b0b0b;
  min-height: 100dvh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const HomeScreen = ({ dictionary }) => {
  return (
    <StyledComponent>
      <BigCircle variant={1} />
      <MainPage dictionary={dictionary} />
    </StyledComponent>
  );
};

export default HomeScreen;
