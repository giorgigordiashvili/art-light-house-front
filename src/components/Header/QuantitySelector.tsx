import React, { useState } from "react";
import styled from "styled-components";
import DecreaseIcon from "./DecreaseIcon";
import IncreaseIcon from "./IncreaseIcon";

const StyledContainer = styled.div`
  width: 106px;
  height: 35px;
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  color: #ffcb40;
  background-color: #2a2a2a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  border-radius: 10px;
`;

const StyledQuantity = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <StyledContainer>
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
