"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #0b0b0b;
  color: white;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: #1a1a1a;
  border-radius: 12px;
  border: 1px solid #333;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #ffcb40;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #222;
  color: white;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #ffcb40;
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  background-color: #ffcb40;
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e6b73a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-top: 10px;
`;

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        const current = (window.location.pathname.split("/")[1] as "ge" | "en") || "ge";
        router.push(`/${current}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Sign In</Title>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </Container>
  );
};

export default SignInPage;
