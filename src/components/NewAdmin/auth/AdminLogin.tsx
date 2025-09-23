"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import styled from "styled-components";

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
`;

const LoginCard = styled.div`
  background: white;
  padding: 48px;
  border-radius: 16px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;

  h1 {
    margin: 0 0 8px 0;
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 1rem;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &.error {
    border-color: #ef4444;
  }
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background: #0056b3;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: -12px;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
`;

const SuccessMessage = styled.div`
  color: #059669;
  font-size: 0.875rem;
  margin-top: -12px;
  padding: 8px 12px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 6px;
`;

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Log error state changes
  useEffect(() => {
    if (error) {
      console.log("🎯 AdminLogin: Error state updated:", error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      console.log("🎯 AdminLogin: Success state updated:", success);
    }
  }, [success]);

  const { signIn, isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    console.log("🎯 AdminLogin: Starting login process");

    try {
      const loginSuccess = await signIn(email, password);
      console.log("🎯 AdminLogin: Login result:", loginSuccess);

      if (loginSuccess) {
        console.log("🎯 AdminLogin: Login successful, setting success message");
        setSuccess("Login successful! Redirecting to admin panel...");
        // Small delay to show success message before redirect
        setTimeout(() => {
          console.log("🎯 AdminLogin: Redirecting to /admin");
          router.replace("/admin");
        }, 1500);
      } else {
        console.log("🎯 AdminLogin: Login failed - no admin privileges");
        const errorMsg = "Access denied. You don't have admin privileges.";
        console.log("🎯 AdminLogin: Setting error message:", errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error("Admin login error:", err);

      // Handle different error scenarios
      if (err?.response?.status === 400) {
        setError("Invalid email or password format.");
      } else if (err?.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err?.response?.status === 403) {
        setError("Access denied. You don't have admin privileges.");
      } else if (err?.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err?.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoginHeader>
            <h1>Admin Panel</h1>
            <p>Checking authentication...</p>
          </LoginHeader>
        </LoginCard>
      </LoginContainer>
    );
  }

  // Don't render login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoginHeader>
            <h1>Admin Panel</h1>
            <p>Redirecting to admin panel...</p>
          </LoginHeader>
        </LoginCard>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <h1>Admin Panel</h1>
          <p>Sign in to manage your art gallery</p>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? "error" : ""}
              placeholder="Enter your email"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? "error" : ""}
              placeholder="Enter your password"
              required
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <SubmitButton type="submit" disabled={isLoading || !!success}>
            {isLoading ? "Signing in..." : success ? "Redirecting..." : "Sign In"}
          </SubmitButton>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin;
