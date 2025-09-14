"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    // NextAuth handles its own callbacks at /api/auth/callback/[provider]
    // This page can redirect users back to home
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LoadingContainer>
      <LoadingText>
        <Spinner />
        ავტორიზაცია...
      </LoadingText>
    </LoadingContainer>
  );
}
