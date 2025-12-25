"use client";
import styled from "styled-components";
import Container from "@/components/FailedPayment/FailedPaymentMain";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: #0b0b0b;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FailedPayment = ({ dictionary }: { dictionary: any }) => {
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
      <Container dictionary={dictionary} />
    </StyledComponent>
  );
};

export default FailedPayment;
