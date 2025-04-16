"use client";
import styled from "styled-components";
import FooterDescription from "./FooterDescription";
import FooterBottom from "./FooterBottom";
import FooterLinks from "./FooterLinks";

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 64px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const Divider = styled.div`
  margin-top: 58px;
  border-top: 1px solid #e9eaeb26;
`;

function FooterContent() {
  return (
    <>
      <TopSection>
        <FooterDescription />
        <FooterLinks />
      </TopSection>
      <Divider />
      <FooterBottom />
    </>
  );
}

export default FooterContent;
