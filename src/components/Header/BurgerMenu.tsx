import React from "react";
import NavItem from "./NavItem";
import styled from "styled-components";

const StyledBurgeMenu = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  display: none;
  flex-direction: column;
  color: white;
  background-color: #1c1c1c;
  padding: 20px 20px 72px 20px;
  z-index: 1000;
  @media (max-width: 1080px) {
    display: flex;
  }
`;

const StyledBurgerMenuContent = styled.div`
  border: 1px solid #2c2c2c;
  border-radius: 14px;
`;

const StyledNavItem = styled.div`
  padding: 20px 0 24px 24px;
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
