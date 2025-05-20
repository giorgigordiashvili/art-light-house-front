import React from "react";
import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";

const StyledContainer = styled.div`
  display: flex;
  gap: 12px;
  background-color: #131313;
  padding: 5px;
  border-radius: 12px;
  width: fit-content;
  @media (max-width: 1080px) {
    width: auto;
  }
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  width: 219px;
  height: 47px;
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  background-color: ${(props) => (props.$active ? "#ffcb40" : "transparent")};
  color: ${(props) => (props.$active ? "#000000" : "#ffffff")};
  font-family: HelRom;
  font-weight: ${(props) => (props.$active ? 700 : 400)};
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$active ? "#ffcb40" : "#2a2a2a")};
  }

  @media (max-width: 1080px) {
    width: 100%;
  }
`;

type Props = {
  activeTab: "auth" | "register";
  setActiveTab: (tab: "auth" | "register") => void;
};

const AuthToggleButtons = ({ activeTab, setActiveTab }: Props) => {
  const { dictionary } = useLanguage();
  return (
    <StyledContainer>
      <ToggleButton $active={activeTab === "auth"} onClick={() => setActiveTab("auth")}>
        {dictionary.header.authorizationModal.title}
      </ToggleButton>
      <ToggleButton $active={activeTab === "register"} onClick={() => setActiveTab("register")}>
        {dictionary.header.registrationModal.title}
      </ToggleButton>
    </StyledContainer>
  );
};

export default AuthToggleButtons;
