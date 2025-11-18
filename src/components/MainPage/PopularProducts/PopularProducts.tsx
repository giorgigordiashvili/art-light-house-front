import React from "react";
import SectionTitle from "../SectionTitle";
import Container from "../../ui/Container";
import styled from "styled-components";
import PopularProductCard from "./PopularProductCard";
import type { HomepageSection } from "@/types/homepage";

const StyledContainer = styled.div`
  margin-top: 121px;
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }
  @media (max-width: 1080px) {
    padding-inline: 0;
    margin-top: 91px;
  }
`;

const StyledCards = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 44px;
  @media (max-width: 1080px) {
    flex-direction: column;
    margin-top: 32px;
    gap: 17px;
  }
`;

interface PopularProductsProps {
  dictionary: any;
  homepageSections: HomepageSection[];
  lang: string;
}

const PopularProducts = ({ dictionary, homepageSections, lang }: PopularProductsProps) => {
  // Map lang to API language key (ge -> ka)
  const apiLang = lang === "ge" ? "ka" : lang;

  // Find "Shop by Room" section (position 2, section_type "category_grid")
  const roomSection = homepageSections?.find(
    (section: HomepageSection) => section.position === 2 && section.section_type === "category_grid"
  );

  // Get section title
  const sectionTitle = roomSection?.title?.[apiLang] || dictionary.title;

  // Get room cards from API data
  const roomCards =
    roomSection?.data
      ?.filter((item: any) => item.is_active)
      ?.sort((a: any, b: any) => a.position - b.position) || [];

  // If no API data, return null (don't show fallback)
  if (!roomSection || roomCards.length === 0) {
    return null;
  }

  return (
    <Container>
      <StyledContainer>
        <SectionTitle text={sectionTitle} image="family" />
        <StyledCards>
          {roomCards.map((room: any) => {
            const nameKey = lang === "en" ? "name_en" : "name_ka";
            return (
              <PopularProductCard
                key={room.id}
                image={room.custom_data?.image || "/assets/bedroom.svg"}
                label={room.custom_data?.[nameKey] || room.label}
                width={room.custom_data?.width || 511}
                isRightAligned={room.custom_data?.is_right_aligned || false}
                isMiddleCard={room.custom_data?.is_middle_card || false}
                changeHeightMobile={room.custom_data?.change_height_mobile || false}
              />
            );
          })}
        </StyledCards>
      </StyledContainer>
    </Container>
  );
};

export default PopularProducts;
