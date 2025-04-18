"use client";
import styled from "styled-components";
import FooterIcons from "./FooterIcons";

const BottomWrapper = styled.div`
  margin-top: 32px;
  font-size: 12px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const Copyright = styled.div`
  width: 189px;
  height: 24px;
  font-weight: 300;
  font-family: Helvetica Neue LT GEO;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
`;

const DesktopOnlyIcons = styled.div`
  @media (max-width: 1080px) {
    display: none;
  }
`;

function FooterBottom() {
  return (
    <BottomWrapper>
      <Copyright>© 2025. All rights reserved.</Copyright>
      <DesktopOnlyIcons>
        <FooterIcons />
      </DesktopOnlyIcons>
    </BottomWrapper>
  );
}

export default FooterBottom;
