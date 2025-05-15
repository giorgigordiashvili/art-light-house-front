import React from "react";
import ContactCard from "./ContactCard";
import styled from "styled-components";
import ContactTitle from "./ContactTitle";
import Container from "../ui/Container";
import SectionTitle from "../MainPage/SectionTitle";

const StyledContainer = styled.div`
  padding-inline: 20px;
  @media (max-width: 1080px) {
    padding-inline: 0;
  }
`;

const StyledCircle = styled.div`
  width: 284px;
  height: 284px;
  opacity: 0.64;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(
    circle,
    rgba(255, 203, 64, 0.44) 0%,
    rgba(255, 203, 64, 0.1) 80%,
    rgba(255, 203, 64, 0) 100%
  );
  filter: blur(100px);
  border-radius: 50%;
  z-index: 1;
  @media (max-width: 1080px) {
    display: none;
  }
`;

const StyledLeftCircle = styled.div`
  width: 284px;
  height: 284px;
  opacity: 0.64;
  position: absolute;
  bottom: 35px;
  background: radial-gradient(
    circle,
    rgba(255, 203, 64, 0.44) 0%,
    rgba(255, 203, 64, 0.1) 80%,
    rgba(255, 203, 64, 0) 100%
  );
  filter: blur(100px);
  border-radius: 50%;
  z-index: 1;
  @media (max-width: 1080px) {
    display: none;
  }
`;

const StyledRightCircle = styled.div`
  width: 284px;
  height: 284px;
  opacity: 0.64;
  position: absolute;
  bottom: -70px;
  right: 0;
  background: radial-gradient(
    circle,
    rgba(255, 203, 64, 0.44) 0%,
    rgba(255, 203, 64, 0.1) 80%,
    rgba(255, 203, 64, 0) 100%
  );
  filter: blur(100px);
  border-radius: 50%;
  z-index: 1;
  @media (max-width: 1080px) {
    display: none;
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
      <StyledCircle />
      <StyledLeftCircle />
      <StyledRightCircle />
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
