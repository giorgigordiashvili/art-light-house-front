import React, { useState } from "react";
import styled from "styled-components";
import InputTitle from "./InputTitle";
import ModalInput from "./ModalInput";
import CloseIcon from "./CloseIcon";
import ModalDescription from "./ModalDescription";
import PrimaryButton from "../Buttons/PrimaryButton";
import ModalTitle from "./ModalTitle";
import { resetPassword } from "@/api/generated/api";
import type { PasswordResetConfirmRequest } from "@/api/generated/interfaces";

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
  max-width: 363px;
  @media (max-width: 1080px) {
    text-align: center;
  }
`;

const StyledPrimaryButton = styled.div`
  margin-top: 25px;
`;

const StyledInput = styled.div`
  margin-top: 24px;
  &:first-of-type {
    margin-top: 48px;
  }
`;

const StyledDescriptionWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

interface PasswordResetVerifyModalProps {
  onClose: () => void;
  onPasswordResetSuccess: () => void;
  email: string;
  dictionary: any;
}

const PasswordResetVerifyModal = ({
  onClose,
  onPasswordResetSuccess,
  email,
  dictionary,
}: PasswordResetVerifyModalProps) => {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClickInside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const validateInputs = () => {
    if (!code.trim()) {
      setError("Verification code is required");
      return false;
    }

    if (code.trim().length !== 6 || !/^\d{6}$/.test(code.trim())) {
      setError("Please enter a valid 6-digit code");
      return false;
    }

    if (!newPassword.trim()) {
      setError("New password is required");
      return false;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);

      const requestData: PasswordResetConfirmRequest = {
        email: email,
        code: code.trim(),
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      };

      await resetPassword(requestData);
      setSuccess("Password reset successfully!");

      // Wait a moment to show success message then close
      setTimeout(() => {
        onPasswordResetSuccess();
      }, 1500);
    } catch (err: any) {
      console.error("Password reset failed:", err);
      setError(err?.response?.data?.message || "Password reset failed. Please try again.");
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
            text={dictionary?.header?.passwordResetVerifyModal?.title || "Reset Password"}
          />
        </StyledTitle>
        <StyledDescriptionWrapper>
          <StyledDescription>
            <ModalDescription
              text={
                dictionary?.header?.passwordResetVerifyModal?.subTitle ||
                `Enter the 6-digit code sent to ${email} and your new password`
              }
            />
          </StyledDescription>
        </StyledDescriptionWrapper>
        <StyledInput>
          <InputTitle
            text={dictionary?.header?.passwordResetVerifyModal?.inputTitle1 || "Verification Code"}
          />
          <ModalInput
            placeholder={
              dictionary?.header?.passwordResetVerifyModal?.placeholder1 || "Enter 6-digit code"
            }
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
        </StyledInput>

        <StyledInput>
          <InputTitle
            text={dictionary?.header?.passwordResetVerifyModal?.inputTitle2 || "New Password"}
          />
          <ModalInput
            type="password"
            placeholder={
              dictionary?.header?.passwordResetVerifyModal?.placeholder2 || "Enter new password"
            }
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </StyledInput>

        <StyledInput>
          <InputTitle
            text={dictionary?.header?.passwordResetVerifyModal?.inputTitle3 || "Confirm Password"}
          />
          <ModalInput
            type="password"
            placeholder={
              dictionary?.header?.passwordResetVerifyModal?.placeholder3 || "Confirm new password"
            }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              loading
                ? "Resetting..."
                : dictionary?.header?.passwordResetVerifyModal?.button1 || "Reset Password"
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

export default PasswordResetVerifyModal;
