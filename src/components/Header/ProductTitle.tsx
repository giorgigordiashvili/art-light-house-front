import React from "react";
import styled, { css } from "styled-components";

type Props = {
  text: string;
  size?: "small" | "large";
};

const StyledText = styled.p<{ size: "small" | "large" }>`
  font-family: Helvetica;
  font-weight: 300;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #ffffff;

  ${({ size }) =>
    size === "large"
      ? css`
          font-size: 16px;
          line-height: 24px;
        `
      : css`
          font-size: 12px;
        `}
`;

const ProductTitle = ({ text, size = "small" }: Props) => {
  return <StyledText size={size}>{text}</StyledText>;
};

export default ProductTitle;
