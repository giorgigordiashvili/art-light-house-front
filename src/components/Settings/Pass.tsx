"use client";
import styled from "styled-components";
import { useState } from "react";
import InputWithLabel from "../Profile/Input";
import SaveButton from "@/ProfileButton/Save";
import Cancel from "@/ProfileButton/Cancel";
// TODO: Password change endpoint not available for clients in new API
// import { apiEcommerceClientPasswordChangeCreate } from "@/api/generated/api";
import type { PasswordChangeRequest } from "@/api/generated/interfaces";
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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(dictionary?.password?.required || "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(dictionary?.password?.mismatch || "New passwords do not match");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload: PasswordChangeRequest = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirm: confirmPassword,
    };

    try {
      setIsLoading(true);
      // TODO: Password change endpoint not available for clients in new API
      // Backend needs to implement: apiEcommerceClientPasswordChangeCreate
      // await apiEcommerceClientPasswordChangeCreate(payload);
      throw new Error("Password change endpoint not implemented in new API");
      // setSuccess(dictionary?.password?.changeSuccess || "Password changed successfully!");
      // resetForm();
    } catch (e: any) {
      const apiMsg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      setError(
        apiMsg ||
          dictionary?.password?.changeFailed ||
          "Failed to change password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setSuccess(null);
    resetForm();
  };

  const hasChanges = !!(currentPassword || newPassword || confirmPassword);
  const isDisabled = isLoading || !hasChanges;

  return (
    <StylePass>
      <Title>{dictionary?.title2}</Title>
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
      <InputsWrapper>
        <LeftColumn>
          <InputWithLabel
            icon="/assets/icons/pass1.svg"
            label={dictionary?.subTitle1}
            placeholder={dictionary?.placeHolder1}
            value={currentPassword}
            onChange={setCurrentPassword}
            isPasswordField
          />
          <InputWithLabel
            icon="/assets/icons/pass2.svg"
            label={dictionary?.subTitle2}
            placeholder={dictionary?.placeHolder2}
            value={newPassword}
            onChange={setNewPassword}
            isPasswordField
          />
          <InputWithLabel
            icon="/assets/icons/pass2.svg"
            label={dictionary?.subTitle3}
            placeholder={dictionary?.placeHolder3}
            value={confirmPassword}
            onChange={setConfirmPassword}
            isPasswordField
          />
        </LeftColumn>
      </InputsWrapper>

      <ButtonRow>
        <Cancel
          dictionary={dictionary}
          onCancel={handleCancel}
          disabled={!hasChanges || isLoading}
        />
        <SaveButton
          dictionary={dictionary}
          onSave={handleSave}
          disabled={isDisabled}
          isLoading={isLoading}
        />
      </ButtonRow>
    </StylePass>
  );
};

export default Pass;
