import React, { useState } from "react";
import styled from "styled-components";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import CloseIcon from "../Header/CloseIcon";
import ModalTitle from "./ModalTitle";
import AuthToggleButtons from "./AuthToggleButtons";
import ModalInput from "./ModalInput";
import InputTitle from "./InputTitle";
import AdditionalAction from "./AdditionalAction";

interface AuthorizationModalProps {
  onClose: () => void;
  onRecoverPasswordClick?: () => void;
  onRegisterSuccess?: () => void;
}


const StyledContainer = styled.div`
  position: fixed;
  top: 93px;
  left: 50%;
  transform: translate(-50%);
  z-index: 1002;
  @media (max-width: 1080px) {
    width: 100%;
    top: auto;
    left: 0;
    transform: none;
    bottom: -1px;
    border-radius: 0px;

  }
`;

const StyledModal = styled.div`
  position: relative;
  background-color: #1c1c1c;
  width: fit-content;
  height: fit-content;
  border-radius: 20px;
  padding: 30px 24px 24px 24px;
  @media (max-width: 1080px) {
    width: auto;
    height: auto;
    border-radius: 0;
    padding: 31px 16px 71px 16px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
`;

const StyledCloseIcon = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
`;

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledAuthToggleButtons = styled.div`
  margin-top: 30px;
`;

const StyledModalInput = styled.div`
  margin-top: 20px;
`;

const StyledForgetPassword = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const StyledPrimaryButton = styled.div<{ $isRegister: boolean }>`
  margin-top: ${({ $isRegister }) => ($isRegister ? "50px" : "24px")};
`;

const AuthorizationModal: React.FC<AuthorizationModalProps> = ({ onClose, onRecoverPasswordClick, onRegisterSuccess }) => {
  const [activeTab, setActiveTab] = useState<"auth" | "register">("auth");

  return (
    <StyledContainer>
      <StyledModal>
        <StyledCloseIcon onClick={onClose}>
          <CloseIcon />
        </StyledCloseIcon>

        <StyledTitle>
          <ModalTitle text={activeTab === "auth" ? "ავტორიზაცია" : "რეგისტრაცია"} />
        </StyledTitle>

        <StyledAuthToggleButtons>
          <AuthToggleButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        </StyledAuthToggleButtons>

        {activeTab === "register" && (
          <StyledModalInput>
            <InputTitle text="სახელი" />
            <ModalInput placeholder="შეიყვანეთ ელ.ფოსტა" />
          </StyledModalInput>
        )}

        <StyledModalInput>
          <InputTitle text="ელ.ფოსტა" />
          <ModalInput placeholder="შეიყვანეთ ელ.ფოსტა" />
        </StyledModalInput>

        <StyledModalInput>
          <InputTitle text="პაროლი" />
          <ModalInput placeholder="თქვენი პაროლი" />
        </StyledModalInput>

        {activeTab === "auth" && (
          <StyledForgetPassword onClick={() => {
            onClose();
            onRecoverPasswordClick?.();
          }}>
            <AdditionalAction text="დაგავიწყდა პაროლი?" />
          </StyledForgetPassword>
        )}
        <StyledPrimaryButton $isRegister={activeTab === "register"}>
          <PrimaryButton
            text={activeTab === "auth" ? "შესვლა" : "რეგისტრაცია"}
            width="460px"
            height="50px"
            onClick={() => {
              if (activeTab === "register") {
                onClose();
                onRegisterSuccess?.();
              }
            }}
          />
        </StyledPrimaryButton>

      </StyledModal>
    </StyledContainer>
  );
};

export default AuthorizationModal;
