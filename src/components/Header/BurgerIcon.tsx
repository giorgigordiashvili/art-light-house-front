import React from "react";
import Image from "next/image";
import styled from "styled-components";

const StyledBurgerMenuWrapper = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 17px;
  height: 12px;
  z-index: 1000;
  cursor: pointer;
  position: relative;

  @media (max-width: 1080px) {
    display: flex;
  }
`;

const StyledBurgerLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: white;
  border-radius: 10px;
`;

const StyledCloseIconWrapper = styled.div`
  position: absolute;
  top: -4px;
  left: -2px;
  width: 20px;
  height: 20px;
`;

type Props = {
  onClick: () => void;
  isOpen: boolean;
};

const BurgerIcon = ({ onClick, isOpen }: Props) => {
  return (
    <StyledBurgerMenuWrapper onClick={onClick}>
      {isOpen ? (
        <StyledCloseIconWrapper>
          <Image src="/assets/xClose.svg" alt="Close menu" width={20} height={20} />
        </StyledCloseIconWrapper>
      ) : (
        <>
          <StyledBurgerLine />
          <StyledBurgerLine />
          <StyledBurgerLine />
        </>
      )}
    </StyledBurgerMenuWrapper>
  );
};

export default BurgerIcon;
