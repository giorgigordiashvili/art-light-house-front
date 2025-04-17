"use client";
import styled from "styled-components";
import Image from "next/image";

const IconsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  gap: 24px;

  @media (max-width: 1080px){
    justify-content: center;
  }

  a {
    cursor: pointer;
    display: flex;
    align-items: center;

    img {
      transition: transform 0.2s ease;
    }

    &:hover img {
      transform: scale(1.1);
    }
  }
`;

function FooterIcons() {
  return (
    <IconsWrapper>
      <a href="#" target="_blank" rel="noopener noreferrer">
        <Image src="/assets/icons/X.icon.svg" alt="X" width={24} height={24} />
      </a>
      <a href="#" target="_blank" rel="noopener noreferrer">
        <Image src="/assets/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />
      </a>
      <a href="#" target="_blank" rel="noopener noreferrer">
        <Image src="/assets/icons/fb.svg" alt="Facebook" width={24} height={24} />
      </a>
    </IconsWrapper>
  );
}

export default FooterIcons;
