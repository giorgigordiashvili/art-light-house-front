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
import type { HomepageSection } from "@/types/homepage";

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

interface HeroAndCategoryProps {
  dictionary: any;
  homepageSections: HomepageSection[];
}

const HeroAndCategory = ({ dictionary, homepageSections }: HeroAndCategoryProps) => {
  // Extract hero banner section from API
  const heroSection = homepageSections?.find(
    (section: HomepageSection) => section.section_type === "hero_banner"
  );

  // Map API data to hero slides format
  const heroSlides =
    heroSection?.data
      ?.filter((item: any) => item.is_active)
      ?.sort((a: any, b: any) => a.position - b.position)
      ?.slice(0, 3)
      ?.map((item: any) => {
        const title = item.custom_data?.title_ka || "";
        const titleWords = title.split(" ");
        return {
          lightText: titleWords[0] || "",
          text: titleWords.slice(1).join(" ") || "",
          description: item.custom_data?.description_ka || "",
          buttonText: item.custom_data?.button_text_ka || "",
          href: item.custom_data?.button_link || "/products",
        };
      }) || [];

  const slides = heroSlides;

  // Get background image and color from API or use defaults
  const backgroundImage = heroSection?.background_image_url || "/assets/BackgroundImage.png";
  const backgroundColor = heroSection?.background_color;

  return (
    <StyledContainer style={backgroundColor ? { backgroundColor } : undefined}>
      <StyledLinearGradient />
      <StyledComponent>
        <Image
          src={backgroundImage}
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
        {slides.length > 0 && (
          <SwiperWrapper>
            <Swiper modules={[Navigation]} navigation={true} loop className="hero-swiper">
              {slides.map((slide: any, index: number) => (
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
        )}
        <StyledCategorySection>
          <DividerLine />
          <Container>
            <StyledCategoryTitle>
              <SectionTitle
                text={
                  homepageSections?.find((s: HomepageSection) => s.section_type === "category_grid")
                    ?.title?.ka || dictionary.CategoryTitle
                }
                image="category"
                imageUrl={
                  homepageSections?.find((s: HomepageSection) => s.section_type === "category_grid")
                    ?.settings?.icon_url
                }
              />
            </StyledCategoryTitle>
          </Container>
        </StyledCategorySection>
        <CategorySection dictionary={dictionary} homepageSections={homepageSections} />
      </ContentWrapper>
    </StyledContainer>
  );
};

export default HeroAndCategory;
