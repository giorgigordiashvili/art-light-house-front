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
import { verifyEmail } from "@/api/generated/api";
import type { EmailVerificationRequest } from "@/api/generated/interfaces";
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

interface RegistrationCodeModalProps {
  onClose: () => void;
  onReturn: () => void;
  onConfirm: () => void;
  email: string;
  verificationToken?: string;
  dictionary?: any;
}

const RegistrationCodeModal = ({
  onClose,
  onReturn,
  onConfirm,
  email,
  verificationToken = "",
  dictionary,
}: RegistrationCodeModalProps) => {
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
      // Ensure we have a verification token (fallback to window storage if needed)
      const token =
        verificationToken ||
        (typeof window !== "undefined" ? (window as any).__reg_verification_token || "" : "");

      const trimmedCode = code.trim();

      if (!token) {
        setError(
          dictionary?.header?.registrationCodeModal?.missingToken ||
            "Verification session expired. Please start registration again."
        );
        return;
      }

      if (!trimmedCode) {
        setError(
          dictionary?.header?.registrationCodeModal?.missingCode ||
            "Please enter the verification code."
        );
        return;
      }

      const requestData: EmailVerificationRequest = {
        verification_token: token,
        code: trimmedCode,
      };
      const resp = await verifyEmail(requestData);
      if (resp?.access && resp?.refresh && resp?.client) {
        loginWithTokens(resp.client, resp.access, resp.refresh);
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
      // TODO: Resend verification code endpoint not available in new API
      // await resendVerificationCode({ email });
      setResendInfo(
        dictionary?.header?.registrationCodeModal?.resendInfo ||
          "Please check your email for the verification code"
      );
    } catch {
      setResendError(
        dictionary?.header?.registrationCodeModal?.resendError ||
          "Failed to send the code. Please try again."
      );
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
      <ModalTitle text={dictionary?.header?.registrationModal?.title || "Registration"} />
      <StyledDescription>
        <ModalDescription
          variant="alt"
          text={
            dictionary?.header?.registrationCodeModal?.subTitle
              ? String(dictionary.header.registrationCodeModal.subTitle).replace(
                  /“([^”]+)”/,
                  `“${email}”`
                )
              : `A one-time confirmation code has been sent to the specified email “${email}”. Please enter it.`
          }
        />
      </StyledDescription>
      <StyledInput>
        <InputTitle
          text={dictionary?.header?.registrationCodeModal?.inputTitle1 || "One-time code"}
        />
        <ModalInput
          placeholder={
            dictionary?.header?.registrationCodeModal?.placeholder1 || "Enter one-time code here"
          }
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </StyledInput>
      {error && <div style={{ color: "#ff4d4f", marginTop: 8, textAlign: "center" }}>{error}</div>}
      <StyledAdditionalAction>
        <AdditionalAction
          text={dictionary?.header?.registrationCodeModal?.button1 || "Resend"}
          onClick={handleResend}
        />
      </StyledAdditionalAction>
      {resendInfo && (
        <div style={{ color: "#52c41a", marginTop: 8, textAlign: "center" }}>{resendInfo}</div>
      )}
      {resendError && (
        <div style={{ color: "#ff4d4f", marginTop: 8, textAlign: "center" }}>{resendError}</div>
      )}
      <StyledPrimaryButton>
        <PrimaryButton
          text={dictionary?.header?.registrationCodeModal?.button2 || "Confirm"}
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
