import React from "react";
import styled from "styled-components";

const StyledButton = styled.div`
  width: 130px;
  height: 35px;
  background-color: #ffcb40;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
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
type Props = {
  text: string;
};

const CompactButton = (props: Props) => {
  return <StyledButton>{props.text}</StyledButton>;
};

export default CompactButton;
