"use client";
import styled from "styled-components";
import Logo from "../Logo/Logo";

const Description = styled.div`
  width: 479px;
  height: 143px;
  left: 80px;
  @media (max-width: 1080px) {
    width: 100%;
    height: auto;
    left: 0;
    margin: 0 auto;
    text-align: left;
  }
`;
const DescriptionText = styled.p`
  color: #ffffff;
  margin-top: 21.18px;
  font-family: Helvetica;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
`;
function FooterDescription({ footer }: any) {
  return (
    <Description>
      <Logo size="large" href="/" />
      <DescriptionText>
        {footer?.description ||
          "Our lighting creates a special environment that is visually appealing and creates an emotional experience."}
      </DescriptionText>
    </Description>
  );
}

export default FooterDescription;
