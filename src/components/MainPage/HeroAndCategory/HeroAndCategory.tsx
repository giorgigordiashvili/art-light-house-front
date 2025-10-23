"use client";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
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

const SwiperWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  .swiper-button-next,
  .swiper-button-prev {
    color: #ffcb40;
    z-index: 3;
    padding-inline: 80px;
    @media (max-width: 1080px) {
      padding-inline: 20px;
    }
  }
`;

const StyledComponent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 876px;
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
  padding-top: 210px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: visible;
  @media (max-width: 1080px) {
    padding-top: 181px;
  }
`;

const StyledDescription = styled.div`
  margin-top: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1080px) {
    padding-top: 14px;
  }
`;

const StyledButton = styled.div`
  margin-top: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 40px;
  @media (max-width: 1080px) {
    margin-top: 0;
    padding-top: 43px;
  }
`;

const StyledCategorySection = styled.div`
  width: 100%;
  margin-top: 111px;
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

const HeroAndCategory = ({ dictionary }: any) => {
  const heroSlides = [
    {
      lightText: dictionary.title.split(" ")[0],
      text: dictionary.title.split(" ")[1] + " " + dictionary.title.split(" ")[2],
      description: dictionary.description,
      buttonText: dictionary.button,
      href: "/products",
    },
    {
      lightText: dictionary.title2.split(" ")[0],
      text: dictionary.title2.split(" ")[1] + " " + dictionary.title2.split(" ")[2],
      description: dictionary.description2,
      buttonText: dictionary.button2,
      href: "/",
    },
    {
      lightText: dictionary.title3.split(" ")[0],
      text: dictionary.title3.split(" ")[1] + " " + dictionary.title3.split(" ")[2],
      description: dictionary.description3,
      buttonText: dictionary.button3,
      href: "/",
    },
  ];

  return (
    <StyledContainer>
      <StyledLinearGradient />
      <StyledComponent>
        <Image
          src="/assets/BackgroundImage.png"
          alt="Hero background"
          fill
          priority
          quality={90}
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </StyledComponent>
      <ContentWrapper>
        <SwiperWrapper>
          <Swiper modules={[Navigation]} navigation={true} loop className="hero-swiper">
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <HeroTitle lightText={slide.lightText} text={slide.text} />
                <StyledDescription>
                  <HeroDescription text={slide.description} />
                </StyledDescription>
                <StyledButton>
                  <ViewPageButton text={slide.buttonText} href={slide.href} />
                </StyledButton>
              </SwiperSlide>
            ))}
          </Swiper>
        </SwiperWrapper>
        <StyledCategorySection>
          <DividerLine />
          <Container>
            <StyledCategoryTitle>
              <SectionTitle text={dictionary.CategoryTitle} image="category" />
            </StyledCategoryTitle>
          </Container>
        </StyledCategorySection>
        <CategorySection dictionary={dictionary} />
      </ContentWrapper>
    </StyledContainer>
  );
};

export default HeroAndCategory;
