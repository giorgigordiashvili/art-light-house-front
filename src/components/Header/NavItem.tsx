"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";

const StyledLink = styled(Link)`
  font-family: HelRom;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #fafafa;
  cursor: pointer;
  transition: 0.2s;
  text-decoration: none;
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
  onClick?: () => void;
};

const NavItem = ({ text, href, onClick }: Props) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <StyledLink href={href} onClick={handleClick} prefetch={true}>
      <p>{text}</p>
    </StyledLink>
  );
};

export default NavItem;
