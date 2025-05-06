import React from "react";
import styled, { css } from "styled-components";

type Props = {
  text: string;
  size?: "small" | "large" | "normal";
};

const StyledText = styled.p<{ size: "small" | "large" | "normal" }>`
  font-family: Helvetica;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #ffffff;

  ${({ size }) =>
    size === "large"
      ? css`
          font-size: 16px;
          line-height: 24px;
          font-weight: 700;
        `
      : size === "normal"
        ? css`
            font-size: 16px;
            line-height: 24px;
            font-weight: 500;
          `
        : css`
            font-size: 12px;
            font-weight: 700;
          `}
`;

const ProductPrice = ({ text, size = "small" }: Props) => {
  return <StyledText size={size}>{text}</StyledText>;
};

export default ProductPrice;
