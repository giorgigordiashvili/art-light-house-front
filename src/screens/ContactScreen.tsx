"use client";
import styled from "styled-components";
import Intro from "@/components/Contact/GoogleMapsCard";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContactScreen = () => {
  return (
    <StyledComponent>
      <Intro />
    </StyledComponent>
  );
};

export default ContactScreen;
