"use client";
import React, { useEffect } from "react";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import Checkout from "@/components/Checkout/CheckoutMain";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import BigCircle from "@/components/ui/BigCircle";

const StyledContainer = styled.div`
  padding-top: 186px;
  padding-bottom: 143px;
  background-color: #0b0b0b;
  @media (max-width: 1080px) {
    padding-top: 157px;
    padding-bottom: 68px;
  }
`;

const StyledCheckout = styled.div``;

const CheckoutScreen = ({ dictionary }: { dictionary: any }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <StyledContainer>
        <BigCircle variant={2} />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Container>
        <StyledCheckout>
          <Checkout dictionary={dictionary} />
        </StyledCheckout>
      </Container>
    </StyledContainer>
  );
};

export default CheckoutScreen;
