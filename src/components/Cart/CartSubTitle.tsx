import React from "react";
import styled from "styled-components";

const StyledComponent = styled.p`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #8c8c8a;
  @media (max-width: 1080px) {
    font-size: 12px;
    text-align: center;
  }
`;

type Props = {
  text: string;
};

const CartSubTitle = (props: Props) => {
  return <StyledComponent>{props.text}</StyledComponent>;
};

export default CartSubTitle;
