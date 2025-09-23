"use client";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLogin from "./AdminLogin";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f9fa;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #6c757d;
  font-size: 1rem;
`;

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAdminAuth();

  console.log(
    "🛡️ AdminAuthGuard: isLoading:",
    isLoading,
    "isAuthenticated:",
    isAuthenticated,
    "user:",
    user
  );

  // Loading state
  if (isLoading) {
    console.log("🛡️ AdminAuthGuard: Showing loading state");
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  // Not authenticated - show login form
  if (!isAuthenticated) {
    console.log("🛡️ AdminAuthGuard: User not authenticated, showing login");
    return <AdminLogin />;
  }

  // User is authenticated
  console.log("🛡️ AdminAuthGuard: User authenticated, showing admin content");
  return <>{children}</>;
};

export default AdminAuthGuard;
