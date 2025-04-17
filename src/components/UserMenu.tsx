import React from "react";
import UserMenuItem from "../components/UserMenuItem";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 304px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 99px;
  right: 0;
  background-color: transparent;
  padding: 0;
  z-index: 1001;

  @media (max-width: 1080px) {
    position: fixed;
    width: 100%;
    bottom: 0;
    top: auto;
    background-color: #1c1c1c;
    padding: 19px 20px 72px 20px;
    right: 0;
  }
`;

const StyledUserMenuContent = styled.div`
  border: 1px solid #2c2c2c;
  border-radius: 14px;
  background-color: #1c1c1c;

  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const StyledUserMenuItem = styled.div`
  border-top: 1px solid #2c2c2c;

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
          <UserMenuItem text="ჩემი დეტალები" icon="/assets/detailsIcon.svg" />
        </StyledUserMenuItem>
        <StyledUserMenuItem>
          <UserMenuItem text="ჩემი მისამართები" icon="/assets/addressIcon.svg" />
        </StyledUserMenuItem>
        <StyledUserMenuItem>
          <UserMenuItem text="ჩემი შეკვეთები" icon="/assets/orderIcon.svg" />
        </StyledUserMenuItem>
        <StyledUserMenuItem>
          <UserMenuItem text="გადახდის მეთოდები" icon="/assets/paymentIcon.svg" />
        </StyledUserMenuItem>
        <StyledUserMenuItem>
          <UserMenuItem text="პარამეტრები" icon="/assets/settingsIcon.svg" />
        </StyledUserMenuItem>
        <StyledUserMenuItem>
          <UserMenuItem text="გასვლა" icon="/assets/exitIcon.svg" color="red" />
        </StyledUserMenuItem>
      </StyledUserMenuContent>
    </StyledContainer>
  );
};

export default UserMenu;
