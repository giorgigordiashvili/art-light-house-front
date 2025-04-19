import React from "react";
import styled from "styled-components";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import ModalInput from "./ModalInput";
import ModalTitle from "./ModalTitle";
import ModalDescription from "./ModalDescription";
import InputTitle from "./InputTitle";
import CloseIcon from "./CloseIcon";
import ReturnIcon from "./ReturnIcon";
import AdditionalAction from "./AdditionalAction";

const StyledContainer = styled.div`
  padding: 30px 24px 35px 24px;
  background-color: #1c1c1c;
  border-radius: 20px;
  position: fixed;
  top: 93px;
  left: 50%;
  transform: translate(-50%);
  z-index: 1002;
  cursor: pointer;
  @media (max-width: 1080px) {
    top: auto;
    left: auto;
    transform: none;
    bottom: 0;
    border-radius: 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    width: 100%;
    padding: 31px 16px 71px 16px;
  }
`;

const StyledCloseIcon = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
`;

const StyledReturnIcon = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  cursor: pointer;
`;

const StyledAdditionalAction = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const StyledDescription = styled.div`
  display: flex;
  justify-content: center;
  max-width: 460px;
  margin-top: 31px;
  text-align: center;
  @media (max-width: 1080px) {
    max-width: none;
    font-size: 18px;
  }
`;

const StyledInput = styled.div`
  margin-top: 52px;
`;

const StyledPrimaryButton = styled.div`
  margin-top: 41px;
`;

const RegistrationCodeModal = ({
  onClose,
  onReturn,
  onConfirm,
}: {
  onClose: () => void;
  onReturn: () => void;
  onConfirm: () => void;
}) => {
  const handleClickInside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <StyledContainer onClick={handleClickInside}>
      <StyledCloseIcon onClick={onClose}>
        <CloseIcon />
      </StyledCloseIcon>
      <StyledReturnIcon onClick={onReturn}>
        <ReturnIcon />
      </StyledReturnIcon>
      <ModalTitle text="რეგისტრაცია" />
      <StyledDescription>
        <ModalDescription
          variant="alt"
          text="მითიტებულ ელ.ფოსტაზე “gagi.murjikneli@gmail.com” გაიგზავნა ერთჯერადი დადასტურების კოდი. გთხოვთ შეიყვანოთ."
        />
      </StyledDescription>
      <StyledInput>
        <InputTitle text="ერჯერადი კოდი" />
        <ModalInput placeholder="ჩაწერე ერთჯერადი კოდი აქ" />
      </StyledInput>
      <StyledAdditionalAction>
        <AdditionalAction text="თავიდან გაგზავნა" />
      </StyledAdditionalAction>
      <StyledPrimaryButton>
        <PrimaryButton text="დადასტურება" width="460px" height="50px" onClick={onConfirm} />
      </StyledPrimaryButton>
    </StyledContainer>
  );
};

export default RegistrationCodeModal;
