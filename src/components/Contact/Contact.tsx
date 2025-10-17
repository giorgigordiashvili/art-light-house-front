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
  dictionary?: any;
};

const Contact: React.FC<ContactProps> = ({ variant = "1", dictionary }) => {
  return (
    <StyledContainer>
      <Container>
        {variant === "1" && <ContactTitle text={dictionary.title2} />}
        {variant === "2" && (
          <StyledSectionTitle>
            <SectionTitle text={dictionary.title} image="address" />
          </StyledSectionTitle>
        )}
        <StyledContactCard $variant={variant}>
          <ContactCard
            side="left"
            dictionary={dictionary}
            location={{ lat: 41.720542, lng: 44.764789 }}
          />
          <ContactCard
            side="right"
            dictionary={dictionary}
            location={{ lat: 41.703998, lng: 44.791769 }}
          />
        </StyledContactCard>
      </Container>
    </StyledContainer>
  );
};

export default Contact;
