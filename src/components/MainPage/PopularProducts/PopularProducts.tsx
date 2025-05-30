import React from "react";
import SectionTitle from "../SectionTitle";
import Container from "../../ui/Container";
import styled from "styled-components";
import PopularProductCard from "./PopularProductCard";

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

const PopularProducts = ({ dictionary }: any) => {
  return (
    <Container>
      <StyledContainer>
        <SectionTitle text={dictionary.title} image="family" />
        <StyledCards>
          <PopularProductCard
            image="/assets/bedroom.svg"
            label={dictionary.bedroom}
            width={511}
            isRightAligned
            changeHeightMobile
          />
          <PopularProductCard
            image="/assets/livingroom.svg"
            label={dictionary.livingroom}
            width={242}
            isMiddleCard
          />
          <PopularProductCard
            image="/assets/kitchen.svg"
            label={dictionary.kitchen}
            width={503}
            isRightAligned
            changeHeightMobile
          />
        </StyledCards>
      </StyledContainer>
    </Container>
  );
};

export default PopularProducts;
