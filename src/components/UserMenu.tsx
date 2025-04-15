import React from 'react'
import UserMenuItem from "../components/UserMenuItem";
import styled from 'styled-components';

const StyledContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    background-color: #1C1C1C;
    padding: 19px 20px 72px 20px;
    z-index: 1000;
`;

const StyledUserMenuContent = styled.div`
    border: 1px solid #2C2C2C;
    border-radius: 14px;
`;

const StyledUserMenuItem = styled.div`
  border-top: 1px solid #2C2C2C;

  &:first-child {
    border-top: none;
  }

  &:last-child {
    color: red;
  }
`;

const UserMenu = () => {
    return (
        <StyledContainer>
            <StyledUserMenuContent>
                <StyledUserMenuItem>
                    <UserMenuItem text='ჩემი დეტალები' icon='/assets/detailsIcon.svg'></UserMenuItem>
                </StyledUserMenuItem>
                <StyledUserMenuItem>
                    <UserMenuItem text='ჩემი მისამართები' icon='/assets/addressIcon.svg'></UserMenuItem>
                </StyledUserMenuItem>
                <StyledUserMenuItem>
                    <UserMenuItem text='ჩემი შეკვეთები' icon='/assets/orderIcon.svg'></UserMenuItem>
                </StyledUserMenuItem>
                <StyledUserMenuItem>
                    <UserMenuItem text='გადახდის მეთოდები' icon='/assets/paymentIcon.svg'></UserMenuItem>
                </StyledUserMenuItem>
                <StyledUserMenuItem>
                    <UserMenuItem text='პარამეტრები' icon='/assets/settingsIcon.svg'></UserMenuItem>
                </StyledUserMenuItem>
                <StyledUserMenuItem>
                    <UserMenuItem text='გასვლა' icon='/assets/exitIcon.svg' color='red'></UserMenuItem>
                </StyledUserMenuItem>
            </StyledUserMenuContent>
        </StyledContainer>
    )
}

export default UserMenu