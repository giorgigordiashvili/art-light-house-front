import React from "react";
import styled, { css } from "styled-components";

type Size = "small" | "medium" | "large";
type Media = "yes" | "no";

interface StyledContainerProps {
  size: Size;
  top?: string;
  right?: string;
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
  ${({ right }) =>
    right &&
    css`
      right: ${right};
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
  @media (max-width: 1080px) {
    display: none;
  }
`;

interface Props {
  size: Size;
  top?: string;
  right?: string;
  media?: Media;
}

const NewCircle = ({ size, top = "0", right = "0", media = "no" }: Props) => {
  return <StyledContainer size={size} top={top} right={right} media={media} />;
};

export default NewCircle;
