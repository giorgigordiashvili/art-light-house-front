import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface StyledContainerProps {
  textcolor?: string;
}

const StyledContainer = styled.div<StyledContainerProps>`
  height: 66px;
  padding: 24px 0 18px 24px;
  font-family: HelRom;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  display: flex;
  align-items: center;
  gap: 18px;
  color: ${(props) => props.textcolor || "#EDEDEDCC"};
  cursor: pointer;
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
  const textcolor = color === "white" ? "white" : color === "red" ? "#FF4545" : undefined;

  const handleClick = () => {
    if (route) {
      router.push(route);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledContainer textcolor={textcolor} onClick={handleClick}>
      <Image src={icon} alt="menu icon" width={24} height={24} />
      <p>{text}</p>
    </StyledContainer>
  );
};

export default UserMenuItem;
