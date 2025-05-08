"use client";
import styled from "styled-components";
import Contact from "@/components/Contact/Contact";

const StyledComponent = styled.div`
  background: black;
  padding-bottom: 130px;
  padding-top: 186px;
  @media (max-width: 1080px) {
    padding-top: 162px;
    padding-bottom: 0;
  }
`;

const ContactScreen = () => {
  return (
    <StyledComponent>
      <Contact variant="1" />
    </StyledComponent>
  );
};

export default ContactScreen;
