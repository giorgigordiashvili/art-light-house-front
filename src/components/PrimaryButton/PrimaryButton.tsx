import React from "react";
import styled from "styled-components";

type Props = {
  text: string;
  width?: string;
  height?: string;
};

const StyledContainer = styled.div``;

const StyledButton = styled.div<{ width?: string; height?: string }>`
  height: ${(props) => props.height || "50px"};
  width: ${(props) => props.width || "252px"};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffcb40;
  border: none;
  border-radius: 10px;
  font-family: HelRom;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  transition: color 0.2s ease;
  cursor: pointer;
  color: #000;

  &:hover {
    color: #fff;
  }
`;

const PrimaryButton = (props: Props) => {
  return (
    <StyledContainer>
      <StyledButton width={props.width} height={props.height}>
        {props.text}
      </StyledButton>
    </StyledContainer>
  );
};

export default PrimaryButton;
