import React from "react";
import NavItem from "./NavItem";
import styled from "styled-components";

const StyledBurgeMenu = styled.div`
  position: fixed;
  top: 72px;
  border-radius: 14px;
  right: 12px;
  display: none;
  flex-direction: column;
  color: white;
  background-color: #1c1c1c;
  z-index: 1001;
  @media (max-width: 1080px) {
    display: flex;
  }
`;

const StyledBurgerMenuContent = styled.div`
  border: 1px solid #2c2c2c;
  border-radius: 14px;
  width: 219px;
`;

const StyledNavItem = styled.div`
  padding: 24px 0 20px 24px;
  border-top: 1px solid #2c2c2c;

  &:first-child {
    border-top: none;
  }
`;

const BurgerMenu = () => {
  return (
    <StyledBurgeMenu>
      <StyledBurgerMenuContent>
        <StyledNavItem>
          <NavItem text="პროდუქცია" href="/products" />
        </StyledNavItem>
        <StyledNavItem>
          <NavItem text="ფასდაკლება" href="/" />
        </StyledNavItem>
        <StyledNavItem>
          <NavItem text="პროექტი" href="/" />
        </StyledNavItem>
        <StyledNavItem>
          <NavItem text="კონტაქტი" href="/contact" />
        </StyledNavItem>
      </StyledBurgerMenuContent>
    </StyledBurgeMenu>
  );
};

export default BurgerMenu;
