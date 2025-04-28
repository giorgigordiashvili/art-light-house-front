import React from "react";
import styled from "styled-components";

const StyledContainer = styled.p`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #ffffff;
  margin-top: 14px;
`;

type Props = {
  text: string;
};

const CartTitle = (props: Props) => {
  return <StyledContainer>{props.text}</StyledContainer>;
};

export default CartTitle;
