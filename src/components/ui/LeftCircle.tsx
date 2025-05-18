import React from "react";
import styled, { css } from "styled-components";

type Size = "small" | "medium" | "large";
type Media = "yes" | "no";

interface StyledContainerProps {
  size: Size;
  top?: string;
  left?: string;
  media?: Media;
}

const sizeMap = {
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

  ${({ top }) =>
    top &&
    css`
      top: ${top};
    `}
  ${({ left }) =>
    left &&
    css`
      left: ${left};
    `}

  transform: translate(50%, -50%);
  background: radial-gradient(
    circle,
    rgba(255, 203, 64, 0.44) 0%,
    rgba(255, 203, 64, 0.1) 60%,
    rgba(255, 203, 64, 0) 100%
  );
  filter: blur(100px);
  border-radius: 50%;
  z-index: 1;

  ${({ media }) =>
    media === "yes" &&
    css`
      @media (max-width: 1079px) {
        display: none;
      }
    `}
`;

interface Props {
  size: Size;
  top?: string;
  left?: string;
  media?: Media;
}

const LeftCircle = ({ size, top = "0", left = "0", media = "no" }: Props) => {
  return <StyledContainer size={size} top={top} left={left} media={media} />;
};

export default LeftCircle;
