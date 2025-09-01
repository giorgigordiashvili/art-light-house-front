import React, { useState } from "react";
import styled from "styled-components";
import PrimaryButton from "../Buttons/PrimaryButton";
import CloseIcon from "../Header/CloseIcon";
import ModalTitle from "./ModalTitle";
import ModalInput from "./ModalInput";
import InputTitle from "./InputTitle";
import { AuthService } from "@/lib/authService";

interface ApiLoginModalProps {
  onClose: () => void;
  onSuccess?: (userData: any) => void;
  dictionary?: any;
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
  margin-bottom: 30px;
`;

const StyledModalInput = styled.div`
  margin-top: 20px;
`;

const StyledPrimaryButton = styled.div`
  margin-top: 30px;
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 8px;
  text-align: left;
`;

const SuccessMessage = styled.div`
  color: #52c41a;
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
`;

const ApiLoginModal: React.FC<ApiLoginModalProps> = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const loginData = {
        email: email,
        password: password,
        password_confirmation: password, // API requires this field
      };

      console.log("Attempting API login...");
      const result = await AuthService.login(loginData);

      console.log("Login successful:", result);

      // Store token if provided
      if (result.token) {
        localStorage.setItem("api_token", result.token);
        console.log("Token stored in localStorage");
      }

      setSuccess("Login successful!");

      // Wait a bit before closing to show success message
      setTimeout(() => {
        onSuccess?.(result);
        onClose();
      }, 1000);
    } catch (apiError: any) {
      console.error("Login failed:", apiError);

      // Handle API login errors
      if (apiError.status === 401) {
        setError("Invalid email or password");
      } else if (apiError.status === 422) {
        setError("Please check your email and password");
      } else if (apiError.errors) {
        const errorMessages = Object.entries(apiError.errors)
          .map(([, messages]: [string, any]) => {
            if (Array.isArray(messages)) {
              return messages.join(", ");
            }
            return messages;
          })
          .filter(Boolean);

        setError(errorMessages.join(", ") || apiError.message);
      } else {
        setError(apiError.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
      <StyledModal>
        <StyledCloseIcon onClick={onClose}>
          <CloseIcon />
        </StyledCloseIcon>

        <StyledTitle>
          <ModalTitle text="Login" />
        </StyledTitle>

        <StyledModalInput>
          <InputTitle text="Email" />
          <ModalInput
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
        </StyledModalInput>

        <StyledModalInput>
          <InputTitle text="Password" />
          <ModalInput
            placeholder="Enter your password"
            iconSrc="/assets/eye.svg"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </StyledModalInput>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <StyledPrimaryButton>
          <PrimaryButton
            text={isLoading ? "Logging in..." : "Login"}
            width="460px"
            height="50px"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </StyledPrimaryButton>
      </StyledModal>
    </StyledContainer>
  );
};

export default ApiLoginModal;
