"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const StyledText = styled.div`
  font-family: HelRom;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #fafafa;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 80%;
  }
  @media (max-width: 1080px) {
    font-size: 16px;
  }
`;

type Props = {
  text: string;
  href: string;
};

const NavItem = ({ text, href }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <StyledText onClick={handleClick}>
      <p>{text}</p>
    </StyledText>
  );
};

export default NavItem;
