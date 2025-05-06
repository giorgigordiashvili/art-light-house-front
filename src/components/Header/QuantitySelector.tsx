import React, { useState } from "react";
import styled, { css } from "styled-components";
import DecreaseIcon from "./DecreaseIcon";
import IncreaseIcon from "./IncreaseIcon";

type Props = {
  size?: "small" | "large"; // optional, defaults to "small"
};

const StyledContainer = styled.div<{ size: "small" | "large" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  color: #ffcb40;
  background-color: #2a2a2a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  border-radius: 10px;

  ${({ size }) =>
    size === "large"
      ? css`
          width: 129px;
          height: 46px;
        `
      : css`
          width: 106px;
          height: 35px;
          position: absolute;
          bottom: 12px;
          right: 12px;
        `}
`;

const StyledQuantity = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const QuantitySelector = ({ size = "small" }: Props) => {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <StyledContainer size={size}>
      <div onClick={decrease} style={{ cursor: "pointer" }}>
        <DecreaseIcon color="#FFCB40" opacity={quantity > 1 ? 1 : 0.5} />
      </div>
      <StyledQuantity>{quantity}</StyledQuantity>
      <div onClick={increase} style={{ cursor: "pointer" }}>
        <IncreaseIcon />
      </div>
    </StyledContainer>
  );
};

export default QuantitySelector;
