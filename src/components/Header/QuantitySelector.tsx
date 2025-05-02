import React from "react";
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

const StyledQuantity = styled.div``;

const QuantitySelector = () => {
  return (
    <StyledContainer>
      <DecreaseIcon />
      <StyledQuantity>1</StyledQuantity>
      <IncreaseIcon />
    </StyledContainer>
  );
};

export default QuantitySelector;
