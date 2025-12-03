"use client";
import styled from "styled-components";
import FooterDescription from "./FooterDescription";
import FooterBottom from "./FooterBottom";
import FooterLinks from "./FooterLinks";
import FooterIcons from "./FooterIcons";

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 64px;

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 32px;
    padding-top: 57px;
  }
`;

const MobileOnlyIcons = styled.div`
  display: none;

  @media (max-width: 1080px) {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }
`;

const Divider = styled.div`
  margin-top: 58px;
  border-top: 1px solid #e9eaeb26;

  @media (max-width: 1080px) {
    margin-top: 41px;
  }
`;

function FooterContent({ footer }: any) {
  return (
    <>
      <TopSection>
        <FooterDescription footer={footer} />
        <FooterLinks footer={footer} />
      </TopSection>

      <MobileOnlyIcons>
        <FooterIcons />
      </MobileOnlyIcons>

      <Divider />
      <FooterBottom />
    </>
  );
}

export default FooterContent;
