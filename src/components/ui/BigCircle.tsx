import React from "react";
import styled, { css } from "styled-components";

type Props = {
  variant?: 1 | 2;
};

const StyledContainer = styled.div<{ variant?: 1 | 2 }>`
  position: absolute;
  top: -600px;
  left: -140px;
  width: 851px;
  height: 851px;
  border-radius: 50%;
  z-index: 1;
  background: transparent;
  @media (max-width: 1080px) {
    width: 546px;
    height: 546px;
    top: -200px;
    left: -290px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    ${({ variant }) =>
      variant === 2
        ? css`
            background: linear-gradient(200.71deg, #000000 38.61%, #584410 88.36%);
          `
        : css`
            background: linear-gradient(200.71deg, #000000 38.61%, #ffd25e 88.36%);
          `};
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - 2px),
      black calc(100% - 1px)
    );
    mask: radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 1px));
    pointer-events: none;
    z-index: -1;
  }
`;

const BigCircle = ({ variant = 1 }: Props) => {
  return <StyledContainer variant={variant} />;
};

export default BigCircle;
