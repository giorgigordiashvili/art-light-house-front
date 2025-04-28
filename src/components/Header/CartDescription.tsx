import React from "react";
import styled from "styled-components";

const StyledContainer = styled.p`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0%;
  text-align: center;
  color: #656971;
  max-width: 311px;
  margin-top: 7px;
`;

type Props = {
  text: string;
};

const CartDescription = (props: Props) => {
  return <StyledContainer>{props.text}</StyledContainer>;
};

export default CartDescription;
