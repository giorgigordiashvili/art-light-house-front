import React from "react";
import styled from "styled-components";

const StyledComponent = styled.p`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #ffffff;
`;

type Props = {
  text: string;
};

const CartTitle = (props: Props) => {
  return <StyledComponent>{props.text}</StyledComponent>;
};

export default CartTitle;
