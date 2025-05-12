"use client";

import { useState } from "react";
import styled from "styled-components";

const TestContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  padding: 20px;
  background-color: #1c1c1c;
  border-radius: 10px;
  color: white;
`;

const Button = styled.button`
  margin: 10px 0;
  padding: 10px 15px;
  background-color: #ffcb40;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #e0b236;
  }
`;

const ResultBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #2a2a2a;
  border-radius: 5px;
  white-space: pre-wrap;
  word-break: break-all;
`;

export default function OAuthTest() {
  const [result, setResult] = useState<string>("");

  const testSSOCallback = async () => {
    try {
      // Simulate visiting the SSO callback route
      const response = await fetch("/sso-callback", { method: "GET" });
      const text = await response.text();

      setResult(`Status: ${response.status}\n\nResponse:\n${text.slice(0, 500)}...`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <TestContainer>
      <h1>OAuth Callback Test</h1>
      <p>This page provides simple tools to test the OAuth callback implementation.</p>

      <Button onClick={testSSOCallback}>Test SSO Callback Route</Button>

      {result && <ResultBox>{result}</ResultBox>}
    </TestContainer>
  );
}
