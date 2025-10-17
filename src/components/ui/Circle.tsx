import React from "react";
import styled, { css } from "styled-components";

type Size = "mobile" | "small" | "medium" | "large";

interface StyledContainerProps {
  size: Size;
}

const sizeMap = {
  mobile: "140px",
  small: "284px",
  medium: "307px",
  large: "374px",
};

const StyledContainer = styled.div<StyledContainerProps>`
  position: absolute;
  ${({ size }) => css`
    width: ${sizeMap[size]};
    height: ${sizeMap[size]};
  `}
  background: radial-gradient(
    circle,
    rgba(255, 203, 64, 0.44) 0%,
    rgba(255, 203, 64, 0.1) 60%,
    rgba(255, 203, 64, 0) 100%
  );
  filter: blur(100px);
  border-radius: 50%;
  z-index: 1;
`;

interface Props {
  size: Size;
}

const Circle = ({ size }: Props) => {
  return <StyledContainer size={size} />;
};

export default Circle;
