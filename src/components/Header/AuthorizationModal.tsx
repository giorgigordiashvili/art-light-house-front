import React, { useState } from "react";
import styled from "styled-components";
import PrimaryButton from "../Buttons/PrimaryButton";
import CloseIcon from "../Header/CloseIcon";
import ModalTitle from "./ModalTitle";
import AuthToggleButtons from "./AuthToggleButtons";
import ModalInput from "./ModalInput";
import InputTitle from "./InputTitle";
import AdditionalAction from "./AdditionalAction";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import Image from "next/image";
import { AuthService } from "@/lib/authService";
import { ApiAuthManager } from "@/lib/apiAuthManager";
import "@/utils/registrationDebugger"; // Enable debugging

interface AuthorizationModalProps {
  onClose: () => void;
  onRecoverPasswordClick?: () => void;
  onRegisterSuccess?: () => void;
  dictionary?: any;
  updateAuthState?: () => void;
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
`;

const StyledAuthToggleButtons = styled.div`
  margin-top: 30px;
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
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 224px;
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

const AuthorizationModal: React.FC<AuthorizationModalProps> = ({
  onClose,
  onRecoverPasswordClick,
  onRegisterSuccess,
  dictionary,
  updateAuthState,
}) => {
  const [activeTab, setActiveTab] = useState<"auth" | "register">("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();

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

  const handlePasswordConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
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
        // Login with API only
        const apiLoginData = {
          email: email,
          password: password,
        };

        console.log("Attempting API login...");
        const apiResult = await AuthService.login(apiLoginData);

        console.log("API Login successful:", apiResult);

        // Store authentication data using ApiAuthManager
        console.log("🔍 About to store login data:", {
          access_token: apiResult.access_token,
          user: apiResult.user,
        });

        // Generate a session token if API doesn't provide one
        let tokenToStore = apiResult.access_token;
        if (!tokenToStore && apiResult.success) {
          // Generate a simple session token since API doesn't provide one
          tokenToStore = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          console.log("🔐 Generated session token:", tokenToStore);
        }

        if (tokenToStore) {
          ApiAuthManager.setToken(tokenToStore);
        }

        if (apiResult.user) {
          ApiAuthManager.setUser(apiResult.user);
        }

        // Update the authentication state in the hook
        console.log("🔄 Updating auth state after login...");
        if (updateAuthState) {
          updateAuthState();
        }

        console.log("Login completed successfully");
        onClose();
      } else {
        // Registration - use both API and Clerk
        if (!firstName) {
          setError(dictionary?.registrationModal?.alert || "Please enter name");
          setIsLoading(false);
          return;
        }

        if (password !== passwordConfirmation) {
          setError(dictionary?.registrationModal?.passwordMismatch || "Passwords do not match");
          setIsLoading(false);
          return;
        }

        try {
          // First, register with backend API
          const apiRegistrationData = {
            first_name: firstName,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
          };

          console.log("Attempting API registration...");
          const apiResult = await AuthService.register(apiRegistrationData);

          console.log("API Registration successful:", apiResult);

          // Store authentication data if provided
          console.log("🔍 About to store registration data:", {
            access_token: apiResult.access_token,
            user: apiResult.user,
          });

          // Generate a session token if API doesn't provide one
          let tokenToStore = apiResult.access_token;
          if (!tokenToStore && apiResult.success) {
            // Generate a simple session token since API doesn't provide one
            tokenToStore = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            console.log("🔐 Generated session token:", tokenToStore);
          }

          if (tokenToStore) {
            ApiAuthManager.setToken(tokenToStore);
          }

          if (apiResult.user) {
            ApiAuthManager.setUser(apiResult.user);
          }

          // Update the authentication state in the hook
          console.log("🔄 Updating auth state after registration...");
          if (updateAuthState) {
            updateAuthState();
          }

          // After successful API registration, just show success
          console.log("Registration completed successfully");
          onRegisterSuccess?.();
          onClose();
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
          setIsLoading(false);
          return;
        }
      }
    } catch (error: any) {
      console.error(error);
      setError(
        activeTab === "auth"
          ? dictionary?.authorizationModal?.invalidCredentials || "invalid email or password"
          : dictionary?.registrationModal?.alert2 ||
              "Error while registering. Please check your details and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    try {
      // Map the provider to the correct Clerk strategy
      const strategy = provider === "google" ? "oauth_google" : "oauth_facebook";

      console.log(`Using OAuth strategy: ${strategy} for provider: ${provider}`);

      // Get the current URL to return to after authentication
      const currentUrl = window.location.pathname + window.location.search;

      if (activeTab === "auth") {
        if (isSignInLoaded) {
          console.log("Initiating sign-in with redirect...");
          await signIn?.authenticateWithRedirect({
            strategy,
            redirectUrl: "/sso-callback",
            redirectUrlComplete: currentUrl || "/", // Return to current page
          });
        } else {
          console.error("Sign-in component not loaded yet");
        }
      } else {
        if (isSignUpLoaded) {
          console.log("Initiating sign-up with redirect...");
          await signUp?.authenticateWithRedirect({
            strategy,
            redirectUrl: "/sso-callback",
            redirectUrlComplete: currentUrl || "/", // Return to current page
          });
        } else {
          console.error("Sign-up component not loaded yet");
        }
      }
    } catch (error) {
      console.error(`Failed to authenticate with ${provider}:`, error);
      // Display more detailed error information in development
      if (process.env.NODE_ENV === "development") {
        console.error("Full error:", JSON.stringify(error, null, 2));
      }
    }
  };

  return (
    <StyledContainer>
      <StyledModal>
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

        {activeTab === "register" && (
          <StyledModalInput>
            <InputTitle text={dictionary?.authorizationModal?.name} />
            <ModalInput
              placeholder={dictionary?.authorizationModal?.namePlaceholder}
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </StyledModalInput>
        )}

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
            iconSrc="/assets/eye.svg"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </StyledModalInput>

        {activeTab === "register" && (
          <StyledModalInput>
            <InputTitle
              text={dictionary?.authorizationModal?.confirmPassword || "Confirm Password"}
            />
            <ModalInput
              placeholder={
                dictionary?.authorizationModal?.confirmPasswordPlaceholder ||
                "Confirm your password"
              }
              iconSrc="/assets/eye.svg"
              type="password"
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
            />
          </StyledModalInput>
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
            width="460px"
            height="50px"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </StyledPrimaryButton>

        <SocialButtons>
          <SocialButton onClick={() => handleSocialSignIn("google")}>
            <Image src="/assets/icons/google-icon.svg" width={20} height={20} alt="Google" />
            {activeTab === "auth"
              ? dictionary?.authorizationModal?.loginWithGoogle
              : dictionary?.authorizationModal?.registerWithGoogle}
          </SocialButton>
          <SocialButton onClick={() => handleSocialSignIn("facebook")}>
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
