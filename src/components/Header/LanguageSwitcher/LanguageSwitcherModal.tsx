import React from "react";
import styled from "styled-components";
import DividerLine from "@/components/MainPage/HeroAndCategory/DividerLine";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ModalLayoutWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const ModalLayout = styled.div`
  width: 1292px;
  display: flex;
  justify-content: flex-end;
`;

const StyledContainer = styled.div`
  width: 154px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 69px;
  background-color: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  padding: 0;
  z-index: 1001;
  margin-right: -34px;
  @media (max-width: 1398px) {
    margin-right: 0;
    right: 20px;
  }
  @media (max-width: 1080px) {
    top: 379px;
  }
`;

const StyledText = styled.p<{ $isActive: boolean }>`
  color: ${(props) => (props.$isActive ? "#FFCB40" : "#fafafa")};
  font-family: Helvetica;
  font-weight: ${(props) => (props.$isActive ? "500" : "400")};
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  padding: 14px 0 14px 14px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
`;

type Props = {
  id?: string;
  onLanguageChange: (language: "ge" | "en") => void;
  currentLanguage: "ge" | "en";
};

const LanguageSwitcherModal = ({ id, onLanguageChange, currentLanguage }: Props) => {
  const pathname = usePathname();

  const handleLanguageSelect = (language: "ge" | "en") => {
    onLanguageChange(language);
  };

  const redirectedPathname = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <ModalLayoutWrapper>
      <ModalLayout>
        <StyledContainer id={id}>
          <Link href={redirectedPathname("ge")}>
            <StyledText
              $isActive={currentLanguage === "ge"}
              onClick={() => handleLanguageSelect("ge")}
            >
              ქართული
            </StyledText>
          </Link>
          <DividerLine variant="dark" />
          <Link href={redirectedPathname("en")}>
            <StyledText
              $isActive={currentLanguage === "en"}
              onClick={() => handleLanguageSelect("en")}
            >
              English
            </StyledText>
          </Link>
        </StyledContainer>
      </ModalLayout>
    </ModalLayoutWrapper>
  );
};

export default LanguageSwitcherModal;
