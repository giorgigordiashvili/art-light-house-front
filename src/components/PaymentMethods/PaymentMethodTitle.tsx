import React from "react";
import styled from "styled-components";

const StyledAddressTitle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px 0 24px 24px;
`;

const StyledTitle = styled.h1`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 18px;
  line-height: 36px;
  color: #ffffff;
  @media (max-width: 1080px) {
    font-size: 16px;
    line-height: 21.86px;
  }
`;

type Props = {
  text: string;
};

const PaymentMethodTitle = ({ text }: Props) => (
  <StyledAddressTitle>
    <StyledTitle>{text}</StyledTitle>
  </StyledAddressTitle>
);

export default PaymentMethodTitle;
