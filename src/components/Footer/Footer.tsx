"use client";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import FooterContent from "./FooterContent";
// import FooterDescription from "./FooterDescription";

const StyledFooter = styled.div`
  background: #000000;
  width: 100%;
  height: 385px;
  top: 3910px;
`;

type Props = {};

function Footer({}: Props) {
  return (
    <StyledFooter>
      <Container>
        <FooterContent />
      </Container>
    </StyledFooter>
  );
}

export default Footer;
