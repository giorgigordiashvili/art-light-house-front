"use client";
import styled from "styled-components";
import { useState } from "react";
import InputWithLabel from "../Profile/Input";
import SaveButton from "@/ProfileButton/Save";
import Cancel from "@/ProfileButton/Cancel";
import { passwordResetRequest, passwordResetConfirm } from "@/api/generated/api";
import type { PasswordResetRequest, PasswordResetConfirm } from "@/api/generated/interfaces";
import { useAuth } from "@/contexts/AuthContext";
const StylePass = styled.div`
  /* width: 800px; */
  width: 100%;
  max-width: 100%;
  min-height: 544px;
  padding: 24px;
  background: #1a1a1a96;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  z-index: 1;
  @media (max-width: 1080px) {
    width: 100%;
    padding: 16px;
    min-height: auto;
  }
`;

const InputsWrapper = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex: 1;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  position: absolute;
  bottom: 24px;
  right: 24px;

  @media (max-width: 1080px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    position: static;
    margin-top: 24px;
  }
`;
const Title = styled.p`
  position: relative;
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 24px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: -24px;
    right: -24px;
    height: 1px;
    background-color: #242424;
  }

  @media (max-width: 1080px) {
    font-size: 16px;
    padding-bottom: 12px;

    &::after {
      left: -16px;
      right: -16px;
    }
  }
`;

const Pass = ({ dictionary }: any) => {
  const { user } = useAuth();
  const [step, setStep] = useState<"request" | "confirm">("request");

  // Step 1: Request reset
  const [email, setEmail] = useState(user?.email || "");

  // Step 2: Confirm reset
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setToken("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
  };

  const handleRequestReset = async () => {
    setError(null);
    setSuccess(null);

    if (!email || !email.trim()) {
      setError(dictionary?.password?.emailRequired || "Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(dictionary?.password?.invalidEmail || "Please enter a valid email address");
      return;
    }

    const payload: PasswordResetRequest = {
      email: email.trim(),
    };

    try {
      setIsLoading(true);
      await passwordResetRequest(payload);
      setSuccess(
        dictionary?.password?.resetEmailSent ||
          "Password reset instructions have been sent to your email. Please check your inbox."
      );
      // Move to confirmation step after 2 seconds
      setTimeout(() => {
        setStep("confirm");
        setSuccess(null);
      }, 2000);
    } catch (e: any) {
      const apiMsg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      setError(
        apiMsg ||
          dictionary?.password?.resetRequestFailed ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    setError(null);
    setSuccess(null);

    if (!token || !token.trim()) {
      setError(
        dictionary?.password?.tokenRequired || "Please enter the reset token from your email"
      );
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError(
        dictionary?.password?.passwordMinLength || "Password must be at least 8 characters long"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(dictionary?.password?.mismatch || "Passwords do not match");
      return;
    }

    const payload: PasswordResetConfirm = {
      token: token.trim(),
      new_password: newPassword,
      new_password_confirm: confirmPassword,
    };

    try {
      setIsLoading(true);
      await passwordResetConfirm(payload);
      setSuccess(
        dictionary?.password?.resetSuccess ||
          "Password has been reset successfully! You can now login with your new password."
      );
      // Reset form after success
      setTimeout(() => {
        resetForm();
        setStep("request");
        setEmail(user?.email || "");
      }, 3000);
    } catch (e: any) {
      const apiMsg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      setError(
        apiMsg ||
          dictionary?.password?.resetConfirmFailed ||
          "Failed to reset password. The token may be invalid or expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setSuccess(null);
    if (step === "confirm") {
      resetForm();
      setStep("request");
    } else {
      setEmail(user?.email || "");
    }
  };

  const hasChanges =
    step === "request"
      ? !!email && email !== user?.email
      : !!(token || newPassword || confirmPassword);
  const isDisabled = isLoading || !hasChanges;

  return (
    <StylePass>
      <Title>
        {step === "request"
          ? dictionary?.password?.resetTitle || "Reset Password"
          : dictionary?.password?.confirmTitle || "Enter Reset Code"}
      </Title>
      {/* Success/Error Messages */}
      {success && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "5px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {success}
        </div>
      )}
      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f44336",
            color: "white",
            borderRadius: "5px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {step === "request" ? (
        <>
          <InputsWrapper>
            <LeftColumn>
              <InputWithLabel
                icon="/assets/icons/pass1.svg"
                label={dictionary?.password?.emailLabel || "Email Address"}
                placeholder={dictionary?.password?.emailPlaceholder || "Enter your email"}
                value={email}
                onChange={setEmail}
                isPasswordField={false}
              />
              <div style={{ color: "#999", fontSize: "14px", marginTop: "-10px" }}>
                {dictionary?.password?.resetInstructions ||
                  "Enter your email address and we'll send you instructions to reset your password."}
              </div>
            </LeftColumn>
          </InputsWrapper>

          <ButtonRow>
            <Cancel
              dictionary={dictionary}
              onCancel={handleCancel}
              disabled={!hasChanges || isLoading}
            />
            <SaveButton
              dictionary={{
                ...dictionary,
                button1: dictionary?.password?.sendResetButton || "Send Reset Email",
              }}
              onSave={handleRequestReset}
              disabled={isDisabled}
              isLoading={isLoading}
            />
          </ButtonRow>
        </>
      ) : (
        <>
          <InputsWrapper>
            <LeftColumn>
              <InputWithLabel
                icon="/assets/icons/pass1.svg"
                label={dictionary?.password?.tokenLabel || "Reset Token"}
                placeholder={dictionary?.password?.tokenPlaceholder || "Enter token from email"}
                value={token}
                onChange={setToken}
                isPasswordField={false}
              />
              <InputWithLabel
                icon="/assets/icons/pass2.svg"
                label={dictionary?.password?.newPasswordLabel || "New Password"}
                placeholder={dictionary?.password?.newPasswordPlaceholder || "Enter new password"}
                value={newPassword}
                onChange={setNewPassword}
                isPasswordField
              />
              <InputWithLabel
                icon="/assets/icons/pass2.svg"
                label={dictionary?.password?.confirmPasswordLabel || "Confirm New Password"}
                placeholder={
                  dictionary?.password?.confirmPasswordPlaceholder || "Confirm new password"
                }
                value={confirmPassword}
                onChange={setConfirmPassword}
                isPasswordField
              />
            </LeftColumn>
          </InputsWrapper>

          <ButtonRow>
            <Cancel dictionary={dictionary} onCancel={handleCancel} disabled={isLoading} />
            <SaveButton
              dictionary={{
                ...dictionary,
                button1: dictionary?.password?.resetButton || "Reset Password",
              }}
              onSave={handleConfirmReset}
              disabled={isDisabled}
              isLoading={isLoading}
            />
          </ButtonRow>
        </>
      )}
    </StylePass>
  );
};

export default Pass;
