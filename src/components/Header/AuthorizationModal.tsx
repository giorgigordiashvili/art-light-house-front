import React, { useState } from "react";
import styled from "styled-components";
import PrimaryButton from "../Buttons/PrimaryButton";
import CloseIcon from "../Header/CloseIcon";
import ModalTitle from "./ModalTitle";
import AuthToggleButtons from "./AuthToggleButtons";
import ModalInput from "./ModalInput";
import InputTitle from "./InputTitle";
import AdditionalAction from "./AdditionalAction";
import { useAuth } from "@/contexts/AuthContext";
import {
  ClientRegistrationRequest,
  ClientLoginRequest,
  EcommerceClient,
} from "@/api/generated/interfaces";
import { registerClient, loginClient } from "@/api/generated/api";
import Image from "next/image";

interface AuthorizationModalProps {
  onClose: () => void;
  onRecoverPasswordClick?: () => void;
  onRegisterSuccess?: (email?: string, verificationToken?: string) => void;
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

const StyledModal = styled.div<{ $isRegister: boolean }>`
  position: relative;
  background-color: #1c1c1c;
  width: fit-content;
  height: fit-content;
  max-height: ${({ $isRegister }) => ($isRegister ? "calc(100vh - 120px)" : "none")};
  overflow-y: ${({ $isRegister }) => ($isRegister ? "auto" : "visible")};
  border-radius: 20px;
  padding: 30px 24px 24px 24px;

  @media (max-width: 1080px) {
    width: auto;
    height: auto;
    max-height: ${({ $isRegister }) => ($isRegister ? "calc(100vh - 100px)" : "none")};
    border-radius: 0;
    padding: 31px 16px 71px 16px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  /* Hide scrollbar but keep functionality */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
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
  width: 100%;
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

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  width: 100%;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  background-color: #2a2a2a;
  border: 1px solid #ffffff12;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  gap: 8px;

  &:hover {
    background-color: #3a3a3a;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 8px;
  text-align: left;
`;

// Grid layout for extra registration fields
const RegisterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
  margin-top: 20px;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const GridItem = styled.div``;

const AuthorizationModal: React.FC<AuthorizationModalProps> = ({
  onClose,
  onRecoverPasswordClick,
  onRegisterSuccess,
  dictionary,
}) => {
  const [activeTab, setActiveTab] = useState<"auth" | "register">("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { loginWithTokens } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    setError("");
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    setError("");
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.target.value);
    setError("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setError(dictionary?.authorizationModal?.alert3 || "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (activeTab === "auth") {
        // Storefront sign in via ecommerce clients login (identifier + password)
        const payload: ClientLoginRequest = {
          identifier: email,
          password,
        };

        const resp = (await loginClient(payload)) as {
          client?: EcommerceClient;
          access?: string;
          refresh?: string;
        };
        if (resp?.client && resp?.access && resp?.refresh) {
          // Persist tokens and user in AuthContext
          loginWithTokens(resp.client, resp.access, resp.refresh);
          onClose();
        } else {
          setError(
            dictionary?.authorizationModal?.invalidCredentials || "Invalid email or password"
          );
        }
      } else {
        // Sign Up via custom API
        if (!firstName) {
          setError(dictionary?.registrationModal?.alert || "Please enter name");
          setIsLoading(false);
          return;
        }

        // Name length validation
        const isNameInvalid = (name: string) => name.trim().length < 2 || name.trim().length > 30;
        // Validate first name with first-name specific message
        if (isNameInvalid(firstName)) {
          setError(
            dictionary?.registrationModal?.invalidNameLength ||
              "The name must be more than 2 characters and not exceed 30 characters."
          );
          setIsLoading(false);
          return;
        }
        // Validate last name (only if provided) with last-name specific message
        if (lastName && isNameInvalid(lastName)) {
          setError(
            dictionary?.registrationModal?.invalidSurnameLength ||
              "Last name must be between 2 and 30 characters."
          );
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError(
            dictionary?.authorizationModal?.passwordConfirmMismatch || "Passwords do not match"
          );
          setIsLoading(false);
          return;
        }

        // Password format validation
        if (password.length < 8) {
          setError(
            dictionary?.registrationModal?.invalidPasswordFormat ||
              "Make sure your password has at least 8 characters."
          );
          setIsLoading(false);
          return;
        }

        // Underage validation (>= 13 years if birthDate provided)
        if (birthDate) {
          const birth = new Date(birthDate);
          const today = new Date();
          let age = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
          if (age < 13) {
            setError(
              dictionary?.registrationModal?.underage ||
                "You must be at least 13 years old to register."
            );
            setIsLoading(false);
            return;
          }
        }

        // Phone number validation (if provided) — simple international format
        if (phoneNumber) {
          const phoneOk = /^\+?[0-9]{7,15}$/.test(phoneNumber.trim());
          if (!phoneOk) {
            setError(
              dictionary?.registrationModal?.invalidPhoneNumber || "Enter a valid phone number."
            );
            setIsLoading(false);
            return;
          }
        }

        const payload: ClientRegistrationRequest = {
          email,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber || "",
          date_of_birth: birthDate || undefined,
          password,
          password_confirm: confirmPassword,
        };

        const resp = await registerClient(payload);
        // Pass both email and verification_token to parent component
        if (resp?.client?.email && resp?.verification_token) {
          onRegisterSuccess?.(resp.client.email, resp.verification_token);
          onClose();
        } else {
          setError(
            dictionary?.registrationModal?.alert2 || "Registration failed. Please try again."
          );
        }
      }
    } catch (error: any) {
      if (activeTab === "auth") {
        // Handle custom API login errors
        let errorMessage =
          dictionary?.authorizationModal?.invalidCredentials || "Invalid email or password";

        if (error?.response?.status === 400) {
          errorMessage =
            dictionary?.authorizationModal?.invalidCredentials || "Invalid email or password";
        } else if (error?.response?.status === 401) {
          errorMessage =
            dictionary?.authorizationModal?.invalidCredentials || "Invalid email or password";
        } else {
          errorMessage =
            dictionary?.authorizationModal?.connectionError ||
            "Connection error. Please try again.";
        }

        setError(errorMessage);
      } else {
        // Handle Clerk registration errors
        const status = error?.response?.status;
        const data = error?.response?.data;
        const msg: string | undefined = data?.message || data?.detail || error?.message;
        const emailErrors = data?.email;

        // Detect email already exists
        if (
          status === 409 ||
          (Array.isArray(emailErrors) && emailErrors.length > 0) ||
          (typeof emailErrors === "string" && emailErrors) ||
          (typeof msg === "string" && /exist|taken|already/i.test(msg))
        ) {
          setError(
            dictionary?.registrationModal?.emailExists ||
              "A user with the provided email already exists."
          );
        } else {
          setError(
            dictionary?.registrationModal?.alert2 ||
              "Error while registering. Please check your details and try again."
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async () => {
    // Social authentication removed - only basic auth is supported
    setError("Social authentication is not available. Please use email and password.");
  };

  return (
    <StyledContainer>
      <StyledModal $isRegister={activeTab === "register"}>
        <StyledCloseIcon onClick={onClose}>
          <CloseIcon />
        </StyledCloseIcon>

        <StyledTitle>
          <ModalTitle
            text={
              activeTab === "auth"
                ? dictionary?.authorizationModal?.title
                : dictionary?.authorizationModal?.registerTitle
            }
          />
        </StyledTitle>

        <StyledAuthToggleButtons>
          <AuthToggleButtons
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dictionary={dictionary}
          />
        </StyledAuthToggleButtons>

        {activeTab === "register" ? (
          <>
            <RegisterGrid>
              <GridItem>
                <StyledModalInput>
                  <InputTitle text={dictionary?.authorizationModal?.name} />
                  <ModalInput
                    placeholder={dictionary?.authorizationModal?.namePlaceholder}
                    value={firstName}
                    onChange={handleFirstNameChange}
                  />
                </StyledModalInput>
                <StyledModalInput>
                  <InputTitle text={dictionary?.authorizationModal?.surname} />
                  <ModalInput
                    placeholder={dictionary?.authorizationModal?.surnamePlaceholder}
                    value={lastName}
                    onChange={handleLastNameChange}
                  />
                </StyledModalInput>
                <StyledModalInput>
                  <InputTitle text={dictionary?.authorizationModal?.birthDate} />
                  <ModalInput
                    placeholder={dictionary?.authorizationModal?.birthDatePlaceholder}
                    type="date"
                    value={birthDate}
                    onChange={handleBirthDateChange}
                    isDateField
                  />
                </StyledModalInput>
                <StyledModalInput>
                  <InputTitle text={dictionary?.authorizationModal?.phoneNumber} />
                  <ModalInput
                    placeholder={dictionary?.authorizationModal?.phoneNumberPlaceholder}
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                  />
                </StyledModalInput>
              </GridItem>
              <GridItem>
                <StyledModalInput>
                  <InputTitle text={dictionary?.authorizationModal?.email} />
                  <ModalInput
                    placeholder={dictionary?.authorizationModal?.emailPlaceholder}
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </StyledModalInput>
                <StyledModalInput>
                  <InputTitle text={dictionary?.authorizationModal?.password} />
                  <ModalInput
                    placeholder={dictionary?.authorizationModal?.passwordPlaceholder}
                    isPasswordField={true}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </StyledModalInput>
                <StyledModalInput>
                  <InputTitle text={dictionary?.authorizationModal?.passwordConfirm} />
                  <ModalInput
                    placeholder={dictionary?.authorizationModal?.passwordConfirmPlaceholder}
                    isPasswordField={true}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </StyledModalInput>
              </GridItem>
            </RegisterGrid>
          </>
        ) : (
          <>
            <StyledModalInput>
              <InputTitle text={dictionary?.authorizationModal?.email} />
              <ModalInput
                placeholder={dictionary?.authorizationModal?.emailPlaceholder}
                value={email}
                onChange={handleEmailChange}
              />
            </StyledModalInput>

            <StyledModalInput>
              <InputTitle text={dictionary?.authorizationModal?.password} />
              <ModalInput
                placeholder={dictionary?.authorizationModal?.passwordPlaceholder}
                isPasswordField={true}
                value={password}
                onChange={handlePasswordChange}
              />
            </StyledModalInput>
          </>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {activeTab === "auth" && (
          <StyledForgetPassword
            onClick={() => {
              onClose();
              onRecoverPasswordClick?.();
            }}
          >
            <AdditionalAction text={dictionary?.authorizationModal?.forgotPassword} />
          </StyledForgetPassword>
        )}

        <StyledPrimaryButton $isRegister={activeTab === "register"}>
          <PrimaryButton
            text={
              activeTab === "auth"
                ? dictionary?.authorizationModal?.loginButton
                : dictionary?.authorizationModal?.registerButton
            }
            width={activeTab === "register" ? "100%" : "460px"}
            height="50px"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </StyledPrimaryButton>

        <SocialButtons>
          <SocialButton onClick={() => handleSocialSignIn()}>
            <Image src="/assets/icons/google-icon.svg" width={20} height={20} alt="Google" />
            {activeTab === "auth"
              ? dictionary?.authorizationModal?.loginWithGoogle
              : dictionary?.authorizationModal?.registerWithGoogle}
          </SocialButton>
          <SocialButton onClick={() => handleSocialSignIn()}>
            <Image src="/assets/icons/facebook-icon.svg" width={20} height={20} alt="Facebook" />
            {activeTab === "auth"
              ? dictionary?.authorizationModal?.loginWithFacebook
              : dictionary?.authorizationModal?.registerWithFacebook}
          </SocialButton>
        </SocialButtons>
      </StyledModal>
    </StyledContainer>
  );
};

export default AuthorizationModal;
