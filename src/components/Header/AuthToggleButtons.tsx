import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  gap: 12px;
  background-color: #131313;
  padding: 5px;
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
`;

const SlidingIndicator = styled.div<{ $activeTab: "auth" | "register" }>`
  position: absolute;
  top: 5px;
  left: 5px;
  height: 47px;
  width: calc((100% - 10px - 12px) / 2);
  border-radius: 10px;
  background-color: #ffcb40;
  transform: ${({ $activeTab }) =>
    $activeTab === "auth" ? "translateX(0)" : "translateX(calc(100% + 12px))"};
  transition: transform 0.25s ease;
  will-change: transform;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1 1 0;
  width: 100%;
  height: 47px;
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  background-color: transparent;
  color: ${(props) => (props.$active ? "#000000" : "#ffffff")};
  font-family: HelRom;
  font-weight: ${(props) => (props.$active ? 700 : 400)};
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  cursor: pointer;
  transition:
    color 0.2s ease,
    font-weight 0.2s ease;
  position: relative;
  z-index: 1;

  &:hover {
    background-color: ${(props) => (props.$active ? "transparent" : "#2a2a2a")};
  }

  @media (max-width: 1080px) {
    width: 100%;
  }
`;

type Props = {
  activeTab: "auth" | "register";
  setActiveTab: (tab: "auth" | "register") => void;
  dictionary?: any;
};

const AuthToggleButtons = ({ activeTab, setActiveTab, dictionary }: Props) => {
  return (
    <StyledContainer>
      <SlidingIndicator $activeTab={activeTab} />
      <ToggleButton
        type="button"
        $active={activeTab === "auth"}
        onClick={() => setActiveTab("auth")}
        aria-pressed={activeTab === "auth"}
      >
        {dictionary?.authorizationModal?.title || "Authorization"}
      </ToggleButton>
      <ToggleButton
        type="button"
        $active={activeTab === "register"}
        onClick={() => setActiveTab("register")}
        aria-pressed={activeTab === "register"}
      >
        {dictionary?.authorizationModal?.registerTitle || "Registration"}
      </ToggleButton>
    </StyledContainer>
  );
};

export default AuthToggleButtons;
