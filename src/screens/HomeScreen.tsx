"use client";
import styled from "styled-components";
import ViewPageButton from "@/components/Buttons/ViewPageButton";
import HeroTitle from "@/components/HeroSection/HeroTitle";

const StyledComponent = styled.div`
  background: red;
  /* height: 1920px; */
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image:
    linear-gradient(
      180deg,
      rgba(11, 11, 11, 0.6) 0%,
      rgba(11, 11, 11, 0.751907) 100%,
      rgba(11, 11, 11, 0.84574) 55.23%,
      #0b0b0b 63.52%
    ),
    url("/assets/Hero/BackgroundImage.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const HomeScreen = () => {
  return (
    <StyledComponent>
      <HeroTitle lightText="გაანათე" text="შენი სახლი" />
      <ViewPageButton text="ყველა პროდუქტი" />
    </StyledComponent>
  );
};

export default HomeScreen;
