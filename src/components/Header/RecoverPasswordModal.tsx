import React, { useState } from "react";
import styled from "styled-components";
import InputTitle from "./InputTitle";
import ModalInput from "./ModalInput";
import CloseIcon from "./CloseIcon";
import ModalDescription from "./ModalDescription";
import PrimaryButton from "../Buttons/PrimaryButton";
import ModalTitle from "./ModalTitle";
import { requestPasswordReset } from "@/api/generated/api";
import type { PasswordResetRequestRequest } from "@/api/generated/interfaces";

const StyledOverlayWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1002;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const StyledContainer = styled.div`
  padding: 30px 24px 35px 24px;
  background-color: #1c1c1c;
  border-radius: 20px;
  position: fixed;
  top: 93px;
  left: 50%;
  transform: translate(-50%);
  z-index: 1002;
  @media (max-width: 1080px) {
    top: auto;
    left: auto;
    transform: none;
    bottom: 0;
    width: 100%;
    border-radius: 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 31px 16px 71px 16px;
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
  justify-content: center;
`;

const StyledDescription = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 19px;
  @media (max-width: 1080px) {
    text-align: center;
  }
`;

const StyledPrimaryButton = styled.div`
  margin-top: 25px;
`;

const StyledInput = styled.div`
  margin-top: 48px;
`;

interface RecoverPasswordModalProps {
  onClose: () => void;
  onPasswordResetRequested: (email: string) => void;
  dictionary: any;
}

const RecoverPasswordModal = ({
  onClose,
  onPasswordResetRequested,
  dictionary,
}: RecoverPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClickInside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const requestData: PasswordResetRequestRequest = {
        email: email.trim(),
      };

      await requestPasswordReset(requestData);
      setSuccess("Reset code sent to your email");

      // Wait a moment to show success message then proceed to verification
      setTimeout(() => {
        onPasswordResetRequested(email.trim());
      }, 1500);
    } catch (err: any) {
      console.error("Password reset request failed:", err);
      setError(err?.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledOverlayWrapper onClick={onClose}>
      <StyledContainer onClick={handleClickInside}>
        <StyledCloseIcon onClick={onClose}>
          <CloseIcon />
        </StyledCloseIcon>
        <StyledTitle>
          <ModalTitle
            text={dictionary?.header?.passwordRecoveryModal?.title || "Password Recovery"}
          />
        </StyledTitle>
        <StyledDescription>
          <ModalDescription
            text={
              dictionary?.header?.passwordRecoveryModal?.subTitle ||
              "To recover your password, enter your registered email"
            }
          />
        </StyledDescription>
        <StyledInput>
          <InputTitle text={dictionary?.header?.passwordRecoveryModal?.inputTitle1 || "Email"} />
          <ModalInput
            placeholder={dictionary?.header?.passwordRecoveryModal?.placeholder1 || "Enter email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <div style={{ color: "#ff4444", fontSize: "14px", marginTop: "8px" }}>{error}</div>
          )}
          {success && (
            <div style={{ color: "#4CAF50", fontSize: "14px", marginTop: "8px" }}>{success}</div>
          )}
        </StyledInput>
        <StyledPrimaryButton>
          <PrimaryButton
            text={
              loading ? "Sending..." : dictionary?.header?.passwordRecoveryModal?.button1 || "Send"
            }
            width="460px"
            height="50px"
            onClick={handleSubmit}
            disabled={loading}
          />
        </StyledPrimaryButton>
      </StyledContainer>
    </StyledOverlayWrapper>
  );
};

export default RecoverPasswordModal;
