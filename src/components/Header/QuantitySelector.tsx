import React from "react";
import styled, { css } from "styled-components";
import DecreaseIcon from "./DecreaseIcon";
import IncreaseIcon from "./IncreaseIcon";

type Props = {
  size?: "small" | "large";
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  disabled?: boolean;
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

const QuantitySelector = ({
  size = "small",
  quantity = 1,
  onIncrease,
  onDecrease,
  disabled,
}: Props) => {
  const increase = () => {
    if (!disabled && onIncrease) onIncrease();
  };
  const decrease = () => {
    if (!disabled && onDecrease) onDecrease();
  };

  return (
    <StyledContainer size={size}>
      <div
        onClick={decrease}
        style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}
      >
        <DecreaseIcon color="#FFCB40" opacity={quantity > 1 ? 1 : 0.5} />
      </div>
      <StyledQuantity>{quantity}</StyledQuantity>
      <div
        onClick={increase}
        style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}
      >
        <IncreaseIcon />
      </div>
    </StyledContainer>
  );
};

export default QuantitySelector;
