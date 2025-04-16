"use client";
import styled from "styled-components";
import Image from "next/image";

const BottomWrapper = styled.div`
  margin-top: 32px;
  font-size: 12px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
`;

const Copyright = styled.div`
  width: 189px;
  height: 24px;
  font-weight: 300;
  font-family: Helvetica Neue LT GEO;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
`;

const Icons = styled.div`
  display: flex;
  gap: 24px;

  a {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  img {
    transition: transform 0.2s ease;
  }

  a:hover img {
    transform: scale(1.1);
  }
`;

function FooterBottom() {
  return (
    <BottomWrapper>
      <Copyright>© 2025. All rights reserved.</Copyright>
      <Icons>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/icons/X.icon.svg" alt="Close" width={24} height={24} />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <Image src="/assets/icons/fb.svg" alt="Facebook" width={24} height={24} />
        </a>
      </Icons>
    </BottomWrapper>
  );
}

export default FooterBottom;
