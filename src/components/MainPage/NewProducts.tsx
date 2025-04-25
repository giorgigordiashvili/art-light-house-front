import React from "react";
import styled from "styled-components";
import SectionTitle from "./SectionTitle";
import ReturnIcon from "../Header/ReturnIcon";
import RightSlide from "./RightSlide";
import Container from "../ui/Container";
import NewProductCard from "./NewProductCard";

const StyledContainer = styled.div`
  margin-top: 120px;
  @media (max-width: 1080px) {
    margin-top: 91px;
  }
`;

const StyledTitleAndActions = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }
  @media (max-width: 1080px) {
    padding-inline: 0;
  }
`;

const StyledActions = styled.div`
  display: flex;
  gap: 11px;
  @media (max-width: 1080px) {
    display: none;
  }
`;

const StyledCards = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 44px;
  overflow: scroll;
  scrollbar-width: none;

  & > * {
    flex-shrink: 0;
  }

  @media (max-width: 1332px) {
    padding-inline: 20px;
  }

  @media (max-width: 1080px) {
    width: calc(100vw);
    padding-inline: 0;
    padding-left: 20px;
    padding-right: 20px;
    margin-left: -20px;
  }
`;

const NewProducts = () => {
  return (
    <Container>
      <StyledContainer>
        <StyledTitleAndActions>
          <SectionTitle text="ახალი პროდუქტები" image="newProduct" />
          <StyledActions>
            <ReturnIcon />
            <RightSlide />
          </StyledActions>
        </StyledTitleAndActions>
        <StyledCards>
          <NewProductCard />
          <NewProductCard />
          <NewProductCard />
          <NewProductCard />
          <NewProductCard />
        </StyledCards>
      </StyledContainer>
    </Container>
  );
};

export default NewProducts;
