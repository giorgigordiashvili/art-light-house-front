import React from "react";
import styled from "styled-components";

type Props = {
  text: string;
};

const StyledText = styled.p`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 12px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #ffffff;
`;

const ProductTitle = (props: Props) => {
  return <StyledText>{props.text}</StyledText>;
};

export default ProductTitle;
