import React from "react";
import styled from "styled-components";

const StyledContainer = styled.p`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #ffffff;
  @media (max-width: 522px) {
    font-size: 11px;
    line-height: 9.98px;
  }
`;

type Props = {
  text: string;
};

const ProductTitle = (props: Props) => {
  return <StyledContainer>{props.text}</StyledContainer>;
};

export default ProductTitle;
