import React from "react";
import ContactCard from "./ContactCard";
import styled from "styled-components";
import ContactTitle from "./ContactTitle";
import Container from "../ui/Container";

const StyledContainer = styled.div`
  padding-inline: 20px;
  @media (max-width: 1080px) {
    padding-inline: 0;
  }
`;

const StyledContactCard = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 89px;
  @media (max-width: 1080px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 44px;
    gap: 24px;
    margin-bottom: 199px;
  }
`;

const Contact = () => {
  return (
    <StyledContainer>
      <Container>
        <ContactTitle text="კონტაქტი" />
        <StyledContactCard>
          <ContactCard side="left" />
          <ContactCard side="right" />
        </StyledContactCard>
      </Container>
    </StyledContainer>
  );
};

export default Contact;
