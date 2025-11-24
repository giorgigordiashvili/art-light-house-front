"use client";
import React from "react";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import PaymentMethods from "@/components/PaymentMethods/PaymentMethods";
import BigCircle from "@/components/ui/BigCircle";

const StyledContainer = styled.div`
  padding-top: 186px;
  padding-bottom: 143px;
  background-color: #0b0b0b;
  overflow-x: visible;
  min-height: 100dvh;
  @media (max-width: 1080px) {
    padding-top: 157px;
    padding-bottom: 68px;
  }
`;

const StyledPaymentMethods = styled.div``;

const PaymentMethodsScreen = ({ dictionary }: any) => {
  return (
    <StyledContainer>
      <BigCircle variant={2} />
      <Container>
        <StyledPaymentMethods>
          <PaymentMethods dictionary={dictionary.paymentMethods} />
        </StyledPaymentMethods>
      </Container>
    </StyledContainer>
  );
};

export default PaymentMethodsScreen;
