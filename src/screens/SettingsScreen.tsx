"use client";
import styled from "styled-components";
import Settings from "@/components/Settings/Settings";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: #0b0b0b;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  align-items: center;
`;

const SettingsScreen = ({ dictionary }: any) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <StyledComponent>
        <BigCircle variant={2} />
      </StyledComponent>
    );
  }

  return (
    <StyledComponent>
      <Settings dictionary={dictionary.settings}></Settings>
    </StyledComponent>
  );
};

export default SettingsScreen;
