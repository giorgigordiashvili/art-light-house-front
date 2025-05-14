import React from "react";
import ContactCard from "./ContactCard";
import styled from "styled-components";
import ContactTitle from "./ContactTitle";
import Container from "../ui/Container";
import SectionTitle from "../MainPage/SectionTitle";
import Circle from "../ui/Circle";

const StyledContainer = styled.div`
  position: relative;
  padding-inline: 20px;
  @media (max-width: 1080px) {
    padding-inline: 0;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  left: 37%;
  transform: translateX(-50%);
  bottom: 120px;
  @media (max-width: 1080px) {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: -50px;
  }
`;

const StyledContactCard = styled.div<{ $variant: "1" | "2" }>`
  display: flex;
  gap: 20px;
  margin-top: ${({ $variant }) => ($variant === "1" ? "89px" : "44px")};
  padding-bottom: ${({ $variant }) => ($variant === "2" ? "202px" : "0")};

  @media (max-width: 1080px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-top: ${({ $variant }) => ($variant === "1" ? "44px" : "46px")};
    padding-bottom: ${({ $variant }) => ($variant === "1" ? "199px" : "108px")};
  }
`;

const StyledSectionTitle = styled.div`
  margin-top: 120px;
  @media (max-width: 1080px) {
    margin-top: 90px;
  }
`;

type ContactProps = {
  variant?: "1" | "2";
};

const Contact: React.FC<ContactProps> = ({ variant = "1" }) => {
  return (
    <StyledContainer>
      <StyledCircle>
        <Circle size="large" />
      </StyledCircle>
      <Container>
        {variant === "1" && <ContactTitle text="კონტაქტი" />}
        {variant === "2" && (
          <StyledSectionTitle>
            <SectionTitle text="მისამართები" image="address" />
          </StyledSectionTitle>
        )}
        <StyledContactCard $variant={variant}>
          <ContactCard side="left" />
          <ContactCard side="right" />
        </StyledContactCard>
      </Container>
    </StyledContainer>
  );
};

export default Contact;
