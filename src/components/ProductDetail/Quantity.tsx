import React from "react";
import styled from "styled-components";

type Props = {
  text: string;
};

const StyledQuantity = styled.p`
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
  letter-spacing: 0%;
  color: #fff;
  @media (max-width: 1080px) {
  }
`;

const Quantity = ({ text }: Props) => {
  return <StyledQuantity>{text}</StyledQuantity>;
};

export default Quantity;
