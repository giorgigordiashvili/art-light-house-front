import React, { useState } from "react";
import styled from "styled-components";
import PrimaryButton from "../Buttons/PrimaryButton";
import ModalInput from "./ModalInput";
import ModalTitle from "./ModalTitle";
import ModalDescription from "./ModalDescription";
import InputTitle from "./InputTitle";
import CloseIcon from "./CloseIcon";
import ReturnIcon from "./ReturnIcon";
import AdditionalAction from "./AdditionalAction";
import { verifyEmail, resendVerificationCode } from "@/api/generated/api";
import { useAuth } from "@/contexts/AuthContext";

const StyledContainer = styled.div`
  padding: 30px 24px 24px 24px;
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
  email,
}: {
  onClose: () => void;
  onReturn: () => void;
  onConfirm: () => void;
  email: string;
}) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendInfo, setResendInfo] = useState("");
  const [resendError, setResendError] = useState("");
  const { loginWithTokens } = useAuth();
  const handleClickInside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setError("");
      const resp = await verifyEmail({ email, code });
      if (resp?.access && resp?.refresh && resp?.user) {
        loginWithTokens(resp.user, resp.access, resp.refresh);
        onConfirm();
      }
    } catch {
      setError("Invalid or expired code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    try {
      setIsResending(true);
      setResendInfo("");
      setResendError("");
      await resendVerificationCode({ email });
      setResendInfo("კოდი ხელახლა გაიგზავნა თქვენს ელ.ფოსტაზე");
    } catch {
      setResendError("ვერ მოხერხდა კოდის გაგზავნა. ცადეთ თავიდან.");
    } finally {
      setIsResending(false);
    }
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
          text={`მითიტებულ ელ.ფოსტაზე “${email}” გაიგზავნა ერთჯერადი დადასტურების კოდი. გთხოვთ შეიყვანოთ.`}
        />
      </StyledDescription>
      <StyledInput>
        <InputTitle text="ერთჯერადი კოდი" />
        <ModalInput
          placeholder="ჩაწერე ერთჯერადი კოდი აქ"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </StyledInput>
      {error && <div style={{ color: "#ff4d4f", marginTop: 8, textAlign: "center" }}>{error}</div>}
      <StyledAdditionalAction>
        <AdditionalAction text="თავიდან გაგზავნა" onClick={handleResend} />
      </StyledAdditionalAction>
      {resendInfo && (
        <div style={{ color: "#52c41a", marginTop: 8, textAlign: "center" }}>{resendInfo}</div>
      )}
      {resendError && (
        <div style={{ color: "#ff4d4f", marginTop: 8, textAlign: "center" }}>{resendError}</div>
      )}
      <StyledPrimaryButton>
        <PrimaryButton
          text="დადასტურება"
          width="460px"
          height="50px"
          onClick={handleVerify}
          disabled={isLoading}
        />
      </StyledPrimaryButton>
    </StyledContainer>
  );
};

export default RegistrationCodeModal;
