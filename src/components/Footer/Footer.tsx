"use client";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import FooterContent from "./FooterContent";

const StyledFooter = styled.div`
  position: sticky;
  z-index: 1;
  background: #000000;
  width: 100%;
  height: 385px;
  top: 3910px;
  padding-inline: 16px;
  @media (max-width: 1080px) {
    height: 900px;
  }
`;

function Footer({ footer }: any) {
  return (
    <StyledFooter>
      <Container>
        <FooterContent footer={footer} />
      </Container>
    </StyledFooter>
  );
}

export default Footer;
