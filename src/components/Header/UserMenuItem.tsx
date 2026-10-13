import React from "react";
import styled, { css } from "styled-components";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

interface StyledContainerProps {
  textcolor?: string;
  $active?: boolean;
}

const Label = styled.p`
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
`;

// Gold highlight shared by hover and the active (current page) item.
// The gradient is painted on the label (not the whole item) so that a label
// wrapping onto two lines keeps every line visible.
const goldHighlight = css`
  filter: brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
    brightness(104%) contrast(102%);

  ${Label} {
    background: linear-gradient(90deg, #f7cb57 0%, #ffd700 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const StyledContainer = styled.div<StyledContainerProps>`
  min-height: 66px;
  padding: 24px 24px 18px 24px;
  font-family: HelRom;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  display: flex;
  align-items: center;
  gap: 18px;
  color: ${(props) => props.textcolor || "#EDEDEDCC"};
  cursor: pointer;
  &:hover {
    ${goldHighlight}
  }
  ${({ $active }) => $active && goldHighlight}
`;

type Props = {
  text: string;
  icon: string;
  color?: "white" | "red";
  route?: string;
  onClick?: () => void;
};

const UserMenuItem = ({ text, icon, color, route, onClick }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const textcolor = color === "white" ? "white" : color === "red" ? "#FF4545" : undefined;
  // Path without the locale prefix, used to detect the active menu item
  const currentPath = (pathname || "/").replace(/^\/(ge|en)(?=\/|$)/, "") || "/";
  const isActive = !!route && (currentPath === route || currentPath.startsWith(`${route}/`));

  const handleClick = (e: React.MouseEvent) => {
    if (route) {
      // Check for Ctrl+click (Windows/Linux) or Cmd+click (Mac) or middle-click
      if (e.ctrlKey || e.metaKey || e.button === 1) {
        window.open(route, "_blank");
        return;
      }
      router.push(route);
    }
    if (onClick) {
      onClick();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Handle middle-click (mouse wheel click) only for routes
    if (e.button === 1 && route) {
      e.preventDefault(); // Prevent default middle-click behavior
      window.open(route, "_blank");
    }
  };

  return (
    <StyledContainer
      textcolor={textcolor}
      $active={isActive}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <Image src={icon} alt="menu icon" width={24} height={24} />
      <Label>{text}</Label>
    </StyledContainer>
  );
};

export default UserMenuItem;
