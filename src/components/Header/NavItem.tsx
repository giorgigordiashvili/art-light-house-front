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

  const handleClick = (e: React.MouseEvent) => {
    // Check for Ctrl+click (Windows/Linux) or Cmd+click (Mac) or middle-click
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      window.open(href, "_blank");
      return;
    }
    router.push(href);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Handle middle-click (mouse wheel click)
    if (e.button === 1) {
      e.preventDefault(); // Prevent default middle-click behavior
      window.open(href, "_blank");
    }
  };

  return (
    <StyledText onClick={handleClick} onMouseDown={handleMouseDown}>
      <p>{text}</p>
    </StyledText>
  );
};

export default NavItem;
