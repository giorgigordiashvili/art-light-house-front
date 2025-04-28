import React from "react";
import styled from "styled-components";
import HeroTitle from "./HeroTitle";
import ViewPageButton from "../../Buttons/ViewPageButton";
import HeroDescription from "./HeroDescription";
import DividerLine from "./DividerLine";
import SectionTitle from "../SectionTitle";
import Container from "../../ui/Container";
import CategorySection from "./CategorySection";

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const StyledComponent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 876px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url("/assets/BackgroundImage.png");
  z-index: 0;
`;

const StyledLinearGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(11, 11, 11, 0.6) 0%,
    rgba(11, 11, 11, 0.751907) 44.74%,
    rgba(11, 11, 11, 0.84574) 55.23%,
    #0b0b0b 63.52%
  );
  z-index: 1;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding-top: 212px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1080px) {
    padding-top: 181px;
  }
`;

const StyledDescription = styled.div`
  margin-top: 38px;
`;

const StyledButton = styled.div`
  margin-top: 70px;
`;

const StyledCategorySection = styled.div`
  width: 100%;
  margin-top: 151px;
  @media (max-width: 1080px) {
    margin-top: 0;
  }
`;

const StyledCategoryTitle = styled.div`
  margin-top: 51px;
  @media (max-width: 1080px) {
    margin-top: 175px;
  }
`;

const HeroAndCategory = () => {
  return (
    <StyledContainer>
      <StyledLinearGradient />
      <StyledComponent />
      <ContentWrapper>
        <HeroTitle lightText="გაანათე" text="შენი სახლი" />
        <StyledDescription>
          <HeroDescription text="ჩვენი განათება ქმნის განსაკუთრებულ გარემოს, რომელიც ვიზუალურად მიმზიდველია და ემოციურ გამოცდილებას ქმნის." />
        </StyledDescription>
        <StyledButton>
          <ViewPageButton text="ყველა პროდუქტი" href="/products" />
        </StyledButton>
        <StyledCategorySection>
          <DividerLine />
          <Container>
            <StyledCategoryTitle>
              <SectionTitle text="აირჩიე გემოვნებით" image="category" />
            </StyledCategoryTitle>
          </Container>
        </StyledCategorySection>
        <CategorySection />
      </ContentWrapper>
    </StyledContainer>
  );
};

export default HeroAndCategory;
