import React from 'react'
import NavItem from './NavItem';
import styled from "styled-components";

const StyledBurgeMenu = styled.div`
    width: 100%;
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: column;
    color: white;
    background-color: #1C1C1C;
    padding: 20px 20px 72px 20px;
    z-index: 1000;
`

const StyledBurgerMenuContent = styled.div`
    border: 1px solid #2C2C2C;
    border-radius: 14px;
`

const StyledNavItem = styled.div`
    padding: 20px 0 24px 24px;
    border-top: 1px solid #2C2C2C;

    &:first-child {
        border-top: none;
    }
`;

const BurgerMenu = () => {
    return (
        <StyledBurgeMenu>
            <StyledBurgerMenuContent>
                <StyledNavItem>
                    <NavItem text='პროდუქცია' />
                </StyledNavItem>
                <StyledNavItem>
                    <NavItem text='ფასდაკლება' />
                </StyledNavItem>
                <StyledNavItem>
                    <NavItem text='პროექტი' />
                </StyledNavItem>
                <StyledNavItem>
                    <NavItem text='კონტაქტი' />
                </StyledNavItem>
            </StyledBurgerMenuContent>
        </StyledBurgeMenu>
    )
}

export default BurgerMenu