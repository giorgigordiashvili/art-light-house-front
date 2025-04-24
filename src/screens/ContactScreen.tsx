"use client";
import styled from "styled-components";
import Contact from "@/components/Contact/Contact";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 1080px) {
    padding-top: 162px;
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
