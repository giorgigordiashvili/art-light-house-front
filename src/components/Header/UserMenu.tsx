import React from "react";
import UserMenuItem from "./UserMenuItem";
import styled from "styled-components";
import { signOut } from "next-auth/react";
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
  closeModal?: () => void;
  dictionary: any;
}

const UserMenu = ({ closeModal, dictionary }: UserMenuProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    if (closeModal) closeModal();
    const current = (window.location.pathname.split("/")[1] as "ge" | "en") || "ge";
    router.push(`/${current}`);
  };

  return (
    <ModalLayoutWrapper>
      <ModalLayout>
        <StyledContainer>
          <StyledUserMenuContent>
            <StyledUserMenuItem>
              <UserMenuItem
                text={dictionary?.header?.detailBar1}
                icon="/assets/detailsIcon.svg"
                route="/profile"
                onClick={closeModal}
              />
            </StyledUserMenuItem>
            <StyledUserMenuItem>
              <UserMenuItem
                text={dictionary?.header?.detailBar2}
                icon="/assets/addressIcon.svg"
                route="/address"
                onClick={closeModal}
              />
            </StyledUserMenuItem>
            <StyledUserMenuItem>
              <UserMenuItem
                text={dictionary?.header?.detailBar3}
                icon="/assets/orderIcon.svg"
                route="/orders"
                onClick={closeModal}
              />
            </StyledUserMenuItem>
            <StyledUserMenuItem>
              <UserMenuItem
                text={dictionary?.header?.detailBar4}
                icon="/assets/paymentIcon.svg"
                onClick={closeModal}
              />
            </StyledUserMenuItem>
            <StyledUserMenuItem>
              <UserMenuItem
                text={dictionary?.header?.detailBar5}
                icon="/assets/settingsIcon.svg"
                onClick={closeModal}
              />
            </StyledUserMenuItem>
            <StyledUserMenuItem onClick={handleSignOut}>
              <UserMenuItem
                text={dictionary?.header?.detailBar6}
                icon="/assets/exitIcon.svg"
                color="red"
              />
            </StyledUserMenuItem>
          </StyledUserMenuContent>
        </StyledContainer>
      </ModalLayout>
    </ModalLayoutWrapper>
  );
};

export default UserMenu;
