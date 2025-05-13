import React from "react";
import styled from "styled-components";

type ColorOption = "red" | "white";

type Props = {
  text: string;
  color?: ColorOption;
  onClick?: () => void;
};

const StyledText = styled.div<{ colorOption?: ColorOption }>`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 12px;
  line-height: 159%;
  text-align: center;
  color: ${({ colorOption }) => (colorOption === "red" ? "#FF2626" : "#FFFFFF")};
  padding: 13px 36px 10px 40px;
  cursor: pointer;
`;

const ModalOption = ({ text, color = "white", onClick }: Props) => {
  return (
    <StyledText colorOption={color} onClick={onClick}>
      {text}
    </StyledText>
  );
};

export default ModalOption;
