import React from "react";
import styled from "styled-components";

const StyledBurgerMenuWrapper = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 17px;
  height: 12px;
  z-index: 1000;
  cursor: pointer;
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

type Props = {
  onClick: () => void;
};

const BurgerIcon = ({ onClick }: Props) => {
  return (
    <StyledBurgerMenuWrapper onClick={onClick}>
      <StyledBurgerLine />
      <StyledBurgerLine />
      <StyledBurgerLine />
    </StyledBurgerMenuWrapper>
  );
};

export default BurgerIcon;
