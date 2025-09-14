"use client";
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
import CartModal from "./CartModal";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import LanguageSwitcherModal from "./LanguageSwitcher/LanguageSwitcherModal";
import { useAuthState } from "@/hooks/useAuthState";
import { usePathname, useRouter } from "next/navigation";
import { Locale, i18n } from "@/config/i18n";
import { useApiAuth } from "@/hooks/useApiAuth";

const ensureValidLanguage = (lang: string): Locale => {
  return i18n.locales.includes(lang as Locale) ? (lang as Locale) : "ge";
};

const StyledContainer = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  padding: 17px 20px 18px 20px;
  background-color: rgba(11, 11, 11, 0.34);
  backdrop-filter: blur(98.8px);
  border-bottom: 1px solid #ffffff14;
  z-index: 1001;

  @media (max-width: 1080px) {
    padding: 17px 0 18px 0;
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

const OverlayWithoutBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

interface HeaderProps {
  header: any;
  dictionary: any;
}

const Header = ({ header, dictionary }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [cartItemCount] = useState<number>(4);
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRecoverPasswordOpen, setIsRecoverPasswordOpen] = useState(false);
  const [isRegistrationCodeOpen, setIsRegistrationCodeOpen] = useState(false);
  const [isRegistrationSuccessOpen, setIsRegistrationSuccessOpen] = useState(false);
  const [isEmptyCartModalOpen, setIsEmptyCartModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartIconColor, setCartIconColor] = useState("#fff");
  const [isLanguageSwitcherModalOpen, setIsLanguageSwitcherModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"ge" | "en">(
    (pathname?.split("/")[1] as "ge" | "en") || "ge"
  );

  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const burgerIconRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const authButtonRef = useRef<HTMLDivElement>(null);

  const toggleBurgerMenu = () => {
    setIsBurgerMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    // console.log(header);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isBurgerMenuOpen ||
      isUserMenuOpen ||
      isEmptyCartModalOpen ||
      isCartModalOpen ||
      isLanguageSwitcherModalOpen
        ? "hidden"
        : "visible";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [
    isBurgerMenuOpen,
    isUserMenuOpen,
    isEmptyCartModalOpen,
    isCartModalOpen,
    isLanguageSwitcherModalOpen,
  ]);

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

      const languageSwitcherElement = document.getElementById("languageSwitcher");
      const languageSwitcherModalElement = document.getElementById("languageSwitcherModal");
      const burgerMenuElement = burgerMenuRef.current;

      if (
        isLanguageSwitcherModalOpen &&
        languageSwitcherElement &&
        !languageSwitcherElement.contains(target) &&
        languageSwitcherModalElement &&
        !languageSwitcherModalElement.contains(target) &&
        (!burgerMenuElement || !burgerMenuElement.contains(target))
      ) {
        setIsLanguageSwitcherModalOpen(false);
      }
    };

    if (isBurgerMenuOpen || isUserMenuOpen || isLanguageSwitcherModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBurgerMenuOpen, isUserMenuOpen, isLanguageSwitcherModalOpen]);

  const isCartEmpty = cartItemCount === 0;
<<<<<<< Updated upstream
  const { user, isSignedIn } = useUser();
<<<<<<< Updated upstream
=======
=======
  const { isAuthenticated, user, isLoading } = useAuthState();
>>>>>>> Stashed changes
  const { isAuthenticated: isApiAuthenticated, user: apiUser, updateAuthState } = useApiAuth();

  // Debug logging
  useEffect(() => {
    console.log("🔍 Header Auth Debug:", {
<<<<<<< Updated upstream
      isSignedIn,
      isApiAuthenticated,
      clerkUser: user,
      apiUser,
      combinedAuth: isSignedIn || isApiAuthenticated,
    });
  }, [isSignedIn, isApiAuthenticated, user, apiUser]);

  // Combine both authentication states
  const isUserAuthorized = isSignedIn || isApiAuthenticated;
=======
      isAuthenticated,
      user,
      isLoading,
      isApiAuthenticated,
      apiUser,
    });
  }, [isAuthenticated, user, isLoading, isApiAuthenticated, apiUser]);

  // Use the combined authentication state
  const isUserAuthorized = isAuthenticated;
>>>>>>> Stashed changes

  // Generate avatar URL for API users
  const generateAvatarUrl = (name: string): string => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFCB40&color=000&size=64&font-size=0.6`;
  };
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes

  const currentUser = {
<<<<<<< Updated upstream
    username:
      user?.firstName ||
      user?.fullName ||
      apiUser?.first_name ||
      apiUser?.email?.split("@")[0] ||
      "User",
    userImage:
      user?.imageUrl ||
      (apiUser?.first_name ? generateAvatarUrl(apiUser.first_name) : "/assets/user.svg"),
=======
<<<<<<< Updated upstream
    username: user?.firstName || user?.fullName || "User",
    userImage: user?.imageUrl || "/assets/user.svg",
=======
    username:
      user?.name ||
      user?.email?.split("@")[0] ||
      apiUser?.first_name ||
      apiUser?.email?.split("@")[0] ||
      "User",
    userImage: user?.image || (user?.name ? generateAvatarUrl(user.name) : "/assets/user.svg"),
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  };

  const closeEmptyCartModal = () => {
    setIsEmptyCartModalOpen(false);
    setCartIconColor("#fff");
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
    setCartIconColor("#fff");
  };

  const handleCartClick = () => {
    if (isCartEmpty) {
      if (isEmptyCartModalOpen) {
        closeEmptyCartModal();
      } else {
        setIsEmptyCartModalOpen(true);
        setCartIconColor("#FFCB40");
      }
    } else {
      if (isCartModalOpen) {
        closeCartModal();
      } else {
        setIsCartModalOpen(true);
        setCartIconColor("#FFCB40");
      }
    }
  };

  const closeLanguageSwitcherModal = () => {
    setIsLanguageSwitcherModalOpen(false);
  };

  const handleLanguageSwitcherClick = () => {
    setIsLanguageSwitcherModalOpen((prev) => !prev);
    closeEmptyCartModal();
    closeCartModal();
  };

  const handleLanguageChange = (language: "ge" | "en") => {
    setSelectedLanguage(language);
    closeLanguageSwitcherModal();

    if (!pathname) return;
    const segments = pathname.split("/");
    segments[1] = language;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <>
      <StyledContainer>
        <Container>
          <StyledContentWrapper>
            <Logo size="small" href="/" />
            <StyledActionsWrapper>
              <StyledNavigation>
                <NavItem text={header.products} href="/products" />
                <NavItem text={header.sale} href="/" />
                <NavItem text={header.project} href="/" />
                <NavItem text={header.contact} href="/contact" />
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
<<<<<<< Updated upstream
                      isClerkUser={isSignedIn} // True if authenticated via Clerk, false if via API
=======
<<<<<<< Updated upstream
=======
                      isClerkUser={isAuthenticated} // True if authenticated, false otherwise
>>>>>>> Stashed changes
>>>>>>> Stashed changes
                      text={header.authorize}
                      onClick={() => {
                        if (isRegistrationCodeOpen) setIsRegistrationCodeOpen(false);
                        if (isRegistrationSuccessOpen) setIsRegistrationSuccessOpen(false);
                        setIsUserMenuOpen(true);
                        closeEmptyCartModal();
                        closeCartModal();
                        closeLanguageSwitcherModal();
                      }}
                    />
                  </div>
                  <div ref={burgerIconRef}>
                    <BurgerIcon
                      isOpen={isBurgerMenuOpen}
                      onClick={() => {
                        toggleBurgerMenu();
                        closeEmptyCartModal();
                        closeCartModal();
                        closeLanguageSwitcherModal();
                      }}
                    />
                  </div>
                </ResponsiveGapWrapper>
                <div id="languageSwitcher" onClick={handleLanguageSwitcherClick}>
                  <LanguageSwitcher
                    language={ensureValidLanguage(pathname.split("/")[1])}
                    display="none"
                  />
                </div>
              </StyledUserActions>
            </StyledActionsWrapper>
          </StyledContentWrapper>
        </Container>
      </StyledContainer>

      {isBurgerMenuOpen && (
        <>
          <OverlayWithoutBackground />
          <div ref={burgerMenuRef}>
            <BurgerMenu
              onLanguageChange={handleLanguageChange}
              currentLanguage={ensureValidLanguage(selectedLanguage)}
              onLanguageSwitcherClick={handleLanguageSwitcherClick}
              dictionary={dictionary}
            />
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
                  <UserMenu closeModal={() => setIsUserMenuOpen(false)} dictionary={dictionary} />
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
                    updateAuthState={updateAuthState}
                    dictionary={header}
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
          <RecoverPasswordModal
            onClose={() => setIsRecoverPasswordOpen(false)}
            dictionary={dictionary}
          />
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
              <EmptyCartModal dictionary={dictionary} />
            </StyledTest>
          </StyledTestWrapper>
        </>
      )}

      {isCartModalOpen && (
        <>
          <Overlay onClick={closeCartModal} />
          <StyledTestWrapper>
            <StyledTest>
              <CartModal
                itemCount={cartItemCount}
                onClose={closeCartModal}
                dictionary={dictionary}
              />{" "}
            </StyledTest>
          </StyledTestWrapper>
        </>
      )}

      {isLanguageSwitcherModalOpen && (
        <>
          <OverlayWithoutBackground onClick={closeLanguageSwitcherModal} />
          <StyledTestWrapper>
            <StyledTest>
              <LanguageSwitcherModal
                id="languageSwitcherModal"
                onLanguageChange={handleLanguageChange}
                currentLanguage={ensureValidLanguage(pathname?.split("/")[1] || "ge")}
              />
            </StyledTest>
          </StyledTestWrapper>
        </>
      )}
    </>
  );
};

export default Header;
