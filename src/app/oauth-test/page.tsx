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

import { useOAuthTest } from "@/lib/oauth-test-util";

export default function OAuthTest() {
  const [manualResult, setManualResult] = useState<string>("");
  const { testGoogleSignIn, testFacebookSignIn, result, error, isLoading } = useOAuthTest();

  const testSSOCallback = async () => {
    try {
      // Simulate visiting the SSO callback route
      const response = await fetch("/sso-callback", { method: "GET" });
      const text = await response.text();

      setManualResult(`Status: ${response.status}\n\nResponse:\n${text.slice(0, 500)}...`);
    } catch (error) {
      setManualResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <TestContainer>
      <h1>OAuth Callback Test</h1>
      <p>This page provides tools to test the OAuth implementation and diagnose issues.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <Button onClick={testGoogleSignIn} disabled={isLoading}>
          {isLoading ? "Loading..." : "Test Google OAuth Sign-In"}
        </Button>

        <Button onClick={testFacebookSignIn} disabled={isLoading}>
          {isLoading ? "Loading..." : "Test Facebook OAuth Sign-In"}
        </Button>

        <Button onClick={testSSOCallback} disabled={isLoading}>
          Test SSO Callback Route
        </Button>
      </div>

      {error && (
        <ResultBox style={{ backgroundColor: "#522", border: "1px solid #800" }}>
          <strong>Error:</strong> {error}
        </ResultBox>
      )}

      {result && <ResultBox>{result}</ResultBox>}

      {manualResult && (
        <ResultBox style={{ marginTop: "20px", backgroundColor: "#253525" }}>
          <strong>Manual Test Result:</strong>
          <br />
          {manualResult}
        </ResultBox>
      )}
    </TestContainer>
  );
}
