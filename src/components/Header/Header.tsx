import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Container from "../ui/Container";
import Logo from "../Logo/Logo";
import NavItem from "./NavItem";
import ShoppingCartIcon from "./ShoppingCartIcon";
import AuthorizationButton from "./AuthorizationButton";
import BurgerIcon from "./BurgerIcon";
import BurgerMenu from "./BurgerMenu";
import UserMenu from "./UserMenu";
import AuthorizationModal from "./AuthorizationModal";
import RecoverPasswordModal from "./RecoverPasswordModal";
import RegistrationCodeModal from "./RegistrationCodeModal";
import RegistrationSuccessModal from "./RegistrationSuccessModal";
import EmptyCartModal from "./EmptyCartModal";

const StyledContainer = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  padding: 20px 20px;
  background-color: rgba(11, 11, 11, 0.34);
  backdrop-filter: blur(98.8px);
  border-bottom: 1px solid #ffffff14;
  z-index: 1001;

  @media (max-width: 1080px) {
    padding: 20px 0;
  }
`;

const StyledNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 33px;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const StyledContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledVerticalLine = styled.div`
  width: 1px;
  height: 18px;
  background-color: #3f3e3d;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const StyledActionsWrapper = styled.div`
  display: flex;
`;

const StyledUserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: 18px;

  @media (max-width: 1080px) {
    gap: 20px;
    margin-left: 0;
  }
`;

const ResponsiveGapWrapper = styled.div`
  display: flex;
  gap: 0;

  @media (max-width: 1080px) {
    gap: 20px;
    align-items: center;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #00000080;
  z-index: 1000;
`;

const StyledTestWrapper = styled.div`
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }
`;

const StyledTest = styled.div`
  width: 1292px;
  display: flex;
  position: relative;
  margin: auto;

  @media (max-width: 1332px) {
    width: 100%;
  }
`;

const Header = () => {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRecoverPasswordOpen, setIsRecoverPasswordOpen] = useState(false);
  const [isRegistrationCodeOpen, setIsRegistrationCodeOpen] = useState(false);
  const [isRegistrationSuccessOpen, setIsRegistrationSuccessOpen] = useState(false);
  const [isEmptyCartModalOpen, setIsEmptyCartModalOpen] = useState(false);
  const [cartIconColor, setCartIconColor] = useState("#fff");

  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const burgerIconRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const authButtonRef = useRef<HTMLDivElement>(null);

  const toggleBurgerMenu = () => {
    setIsBurgerMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    document.body.style.overflow =
      isBurgerMenuOpen || isUserMenuOpen || isEmptyCartModalOpen ? "hidden" : "visible";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isBurgerMenuOpen, isUserMenuOpen, isEmptyCartModalOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedOutsideBurgerMenu =
        burgerMenuRef.current && !burgerMenuRef.current.contains(target);
      const clickedOutsideBurgerIcon =
        burgerIconRef.current && !burgerIconRef.current.contains(target);

      if (isBurgerMenuOpen && clickedOutsideBurgerMenu && clickedOutsideBurgerIcon) {
        setIsBurgerMenuOpen(false);
      }

      const clickedOutsideUserMenu = userMenuRef.current && !userMenuRef.current.contains(target);
      const clickedOutsideAuthButton =
        authButtonRef.current && !authButtonRef.current.contains(target);

      if (isUserMenuOpen && clickedOutsideUserMenu && clickedOutsideAuthButton) {
        setIsUserMenuOpen(false);
      }
    };

    if (isBurgerMenuOpen || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBurgerMenuOpen, isUserMenuOpen]);

  const cartItemCount = 7;
  const isCartEmpty = true;
  const isUserAuthorized = false;
  const currentUser = {
    username: "Nikoloz Baratashvili",
    userImage: "/assets/user.svg",
  };

  const handleCartClick = () => {
    if (isCartEmpty) {
      if (isEmptyCartModalOpen) {
        closeEmptyCartModal();
      } else {
        setIsEmptyCartModalOpen(true);
        setCartIconColor("#FFCB40");
      }
    }
  };

  const closeEmptyCartModal = () => {
    setIsEmptyCartModalOpen(false);
    setCartIconColor("#fff");
  };

  return (
    <>
      <StyledContainer>
        <Container>
          <StyledContentWrapper>
            <Logo size="small" href="/" />
            <StyledActionsWrapper>
              <StyledNavigation>
                <NavItem text="პროდუქცია" href="/products" />
                <NavItem text="ფასდაკლება" href="/" />
                <NavItem text="პროექტი" href="/" />
                <NavItem text="კონტაქტი" href="/contact" />
              </StyledNavigation>
              <StyledUserActions>
                <StyledVerticalLine />
                <ShoppingCartIcon
                  itemCount={cartItemCount}
                  onClick={handleCartClick}
                  color={cartIconColor}
                />
                <ResponsiveGapWrapper>
                  <div ref={authButtonRef}>
                    <AuthorizationButton
                      isAuthorized={isUserAuthorized}
                      username={currentUser.username}
                      userImage={currentUser.userImage}
                      text="ავტორიზაცია"
                      onClick={() => {
                        if (isRegistrationCodeOpen) setIsRegistrationCodeOpen(false);
                        if (isRegistrationSuccessOpen) setIsRegistrationSuccessOpen(false);
                        setIsUserMenuOpen(true);
                        closeEmptyCartModal();
                      }}
                    />
                  </div>
                  <div ref={burgerIconRef}>
                    <BurgerIcon
                      onClick={() => {
                        toggleBurgerMenu();
                        closeEmptyCartModal();
                      }}
                    />
                  </div>
                </ResponsiveGapWrapper>
              </StyledUserActions>
            </StyledActionsWrapper>
          </StyledContentWrapper>
        </Container>
      </StyledContainer>

      {isBurgerMenuOpen && (
        <>
          <Overlay />
          <div ref={burgerMenuRef}>
            <BurgerMenu />
          </div>
        </>
      )}

      <StyledTestWrapper>
        <StyledTest>
          {isUserMenuOpen && (
            <>
              <Overlay />
              <div ref={userMenuRef}>
                {isUserAuthorized ? (
                  <UserMenu />
                ) : (
                  <AuthorizationModal
                    onClose={() => setIsUserMenuOpen(false)}
                    onRecoverPasswordClick={() => {
                      setIsUserMenuOpen(false);
                      setIsRecoverPasswordOpen(true);
                    }}
                    onRegisterSuccess={() => {
                      setIsUserMenuOpen(false);
                      setIsRegistrationCodeOpen(true);
                    }}
                  />
                )}
              </div>
            </>
          )}
        </StyledTest>
      </StyledTestWrapper>

      {isRecoverPasswordOpen && (
        <>
          <Overlay onClick={() => setIsRecoverPasswordOpen(false)} />
          <RecoverPasswordModal onClose={() => setIsRecoverPasswordOpen(false)} />
        </>
      )}
      {isRegistrationCodeOpen && (
        <>
          <Overlay onClick={() => setIsRegistrationCodeOpen(false)} />
          <RegistrationCodeModal
            onClose={() => setIsRegistrationCodeOpen(false)}
            onReturn={() => {
              setIsRegistrationCodeOpen(false);
              setIsUserMenuOpen(true);
            }}
            onConfirm={() => {
              setIsRegistrationCodeOpen(false);
              setIsRegistrationSuccessOpen(true);
            }}
          />
        </>
      )}
      {isRegistrationSuccessOpen && (
        <>
          <Overlay onClick={() => setIsRegistrationSuccessOpen(false)} />
          <RegistrationSuccessModal onClose={() => setIsRegistrationSuccessOpen(false)} />
        </>
      )}
      {isEmptyCartModalOpen && (
        <>
          <Overlay onClick={closeEmptyCartModal} />
          <StyledTestWrapper>
            <StyledTest>
              <EmptyCartModal />
            </StyledTest>
          </StyledTestWrapper>
        </>
      )}
    </>
  );
};

export default Header;
