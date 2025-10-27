import React from "react";
import Styled from "styled-components";

type Props = {
  text: string;
};

const StyledInput = Styled.input`
  background-color: #111111;   
  border: 1px solid #333333;
  border-radius: 8px;
  color: #ffffff;
  padding: 10px 12px;
  font-size: 14px; 
  width: 131px;
  height: 38px;
  cursor: pointer;
  outline: none;

  &::placeholder {
    color: #777777;
  }
`;

const PriceInput: React.FC<Props> = ({ text }) => {
  return <StyledInput placeholder={text} />;
};

export default PriceInput;
