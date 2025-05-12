"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0b0b0b;
  color: #ffffff;
  font-size: 18px;
`;

const LoadingText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 203, 64, 0.3);
  border-radius: 50%;
  border-top: 4px solid #ffcb40;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function SSOCallback() {
  return (
    <LoadingContainer>
      <LoadingText>
        <Spinner />
        ავტორიზაცია...
      </LoadingText>
      {/* The AuthenticateWithRedirectCallback component handles the OAuth callback automatically */}
      <AuthenticateWithRedirectCallback
        /* We don't need sign-in/sign-up URLs since we use modals everywhere */
        redirectUrl="/sso-callback"
        /* The redirectUrlComplete is passed from the AuthorizationModal to preserve the user's location */
      />
    </LoadingContainer>
  );
}
