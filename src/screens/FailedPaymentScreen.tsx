"use client";
import styled from "styled-components";
import Container from "@/components/FailedPayment/FailedPaymentMain";

const StyledComponent = styled.div`
  background: #0b0b0b;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FailedPayment = ({ dictionary }: { dictionary: any }) => {
  return (
    <StyledComponent>
      <Container dictionary={dictionary} />
    </StyledComponent>
  );
};

export default FailedPayment;
