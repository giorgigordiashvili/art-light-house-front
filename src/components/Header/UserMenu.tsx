import React from "react";
import UserMenuItem from "./UserMenuItem";
import styled from "styled-components";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const StyledContainer = styled.div`
  width: 304px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 99px;
  background-color: transparent;
  padding: 0;
  z-index: 1001;

  @media (max-width: 1332px) {
    right: 20px;
  }

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

const ModalLayoutWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const ModalLayout = styled.div`
  width: 1292px;
  display: flex;
  justify-content: flex-end;
`;

interface UserMenuProps {
  onClose?: () => void;
}

const UserMenu = ({ onClose }: UserMenuProps) => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    if (onClose) onClose();
    router.push("/");
  };

  const handleMenuItemClick = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  return (
    <ModalLayoutWrapper>
      <ModalLayout>
        <StyledContainer>
          <StyledUserMenuContent>
            <StyledUserMenuItem onClick={() => handleMenuItemClick("/profile")}>
              <UserMenuItem text="ჩემი დეტალები" icon="/assets/detailsIcon.svg" />
            </StyledUserMenuItem>
            <StyledUserMenuItem onClick={() => handleMenuItemClick("/profile/addresses")}>
              <UserMenuItem text="ჩემი მისამართები" icon="/assets/addressIcon.svg" />
            </StyledUserMenuItem>
            <StyledUserMenuItem onClick={() => handleMenuItemClick("/orders")}>
              <UserMenuItem text="ჩემი შეკვეთები" icon="/assets/orderIcon.svg" />
            </StyledUserMenuItem>
            <StyledUserMenuItem onClick={() => handleMenuItemClick("/profile/payment")}>
              <UserMenuItem text="გადახდის მეთოდები" icon="/assets/paymentIcon.svg" />
            </StyledUserMenuItem>
            <StyledUserMenuItem onClick={() => handleMenuItemClick("/profile/settings")}>
              <UserMenuItem text="პარამეტრები" icon="/assets/settingsIcon.svg" />
            </StyledUserMenuItem>
            <StyledUserMenuItem onClick={handleSignOut}>
              <UserMenuItem text="გასვლა" icon="/assets/exitIcon.svg" color="red" />
            </StyledUserMenuItem>
          </StyledUserMenuContent>
        </StyledContainer>
      </ModalLayout>
    </ModalLayoutWrapper>
  );
};

export default UserMenu;
