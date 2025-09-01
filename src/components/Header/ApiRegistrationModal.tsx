import React, { useState } from "react";
import styled from "styled-components";
import PrimaryButton from "../Buttons/PrimaryButton";
import CloseIcon from "../Header/CloseIcon";
import ModalTitle from "./ModalTitle";
import ModalInput from "./ModalInput";
import InputTitle from "./InputTitle";
import { AuthService } from "@/lib/authService";

interface ApiRegistrationModalProps {
  onClose: () => void;
  onSuccess?: () => void;
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
  margin-top: 40px;
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

const ApiRegistrationModal: React.FC<ApiRegistrationModalProps> = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
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

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    setError("");
    setSuccess("");
  };

  const handlePasswordConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    if (!email || !password || !firstName || !passwordConfirmation) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const registrationData = {
        first_name: firstName,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      };

      const result = await AuthService.register(registrationData);

      console.log("Registration successful:", result);
      setSuccess("Registration successful! You can now sign in with your credentials.");

      // Wait a bit before closing to show success message
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (apiError: any) {
      console.error("Registration failed:", apiError);

      // Handle API registration errors
      if (apiError.errors) {
        // Handle field-specific errors from API
        const errorMessages = Object.entries(apiError.errors)
          .map(([, messages]: [string, any]) => {
            if (Array.isArray(messages)) {
              return messages.join(", ");
            }
            return messages;
          })
          .filter(Boolean);

        setError(errorMessages.join(", ") || apiError.message);
      } else if (apiError.status === 422) {
        setError("Validation failed. Please check your input and try again.");
      } else if (apiError.status === 409) {
        setError("User already exists with this email address.");
      } else {
        setError(apiError.message || "Registration failed. Please try again.");
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
          <ModalTitle text="Register" />
        </StyledTitle>

        <StyledModalInput>
          <InputTitle text="First Name" />
          <ModalInput
            placeholder="Enter your first name"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </StyledModalInput>

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

        <StyledModalInput>
          <InputTitle text="Confirm Password" />
          <ModalInput
            placeholder="Confirm your password"
            iconSrc="/assets/eye.svg"
            type="password"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
          />
        </StyledModalInput>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <StyledPrimaryButton>
          <PrimaryButton
            text={isLoading ? "Registering..." : "Register"}
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

export default ApiRegistrationModal;
