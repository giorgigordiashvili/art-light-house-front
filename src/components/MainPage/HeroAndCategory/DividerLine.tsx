import React from "react";
import styled, { css } from "styled-components";

type Variant = "light" | "dark";

interface StyledLineProps {
  variant: Variant;
}

const StyledLine = styled.div<StyledLineProps>`
  width: 100%;
  height: 1px;

  ${({ variant }) =>
    variant === "dark"
      ? css`
          border-top: 1px solid #242424;
        `
      : css`
          border-top: 1px solid #3b3a36;
        `}

  @media (max-width: 1080px) {
    display: none;
  }
`;

interface DividerLineProps {
  variant?: Variant;
}

const DividerLine: React.FC<DividerLineProps> = ({ variant = "light" }) => {
  return <StyledLine variant={variant} />;
};

export default DividerLine;
