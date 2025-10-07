import React, { useState } from "react";
import styled from "styled-components";

type Props = {
  text: string;
  onClick?: () => void;
  isActive?: boolean;
  onToggle?: (isActive: boolean) => void;
};

type StyledProps = {
  $isActive: boolean;
};

const StyledButton = styled.p<StyledProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Helvetica;
  font-weight: 400;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 0%;
  color: ${(props) => (props.$isActive ? "#000000" : "#ffcb40")};
  border: 1px solid #ffcb401a;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border-radius: 10px;
  background-color: ${(props) => (props.$isActive ? "#ffcb40" : "#1c1c1c")};
  width: 150px;

  @media (max-width: 1080px) {
    font-size: 14px;
  }

  &:hover {
    color: ${(props) => (props.$isActive ? "#000000" : "#fbe4a7")};
  }
`;

const ToggleDefaultButton = ({ text, onClick, isActive: controlledIsActive, onToggle }: Props) => {
  const [internalIsActive, setInternalIsActive] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isActive = controlledIsActive !== undefined ? controlledIsActive : internalIsActive;

  const handleClick = () => {
    const newActiveState = !isActive;

    // Update internal state if not controlled
    if (controlledIsActive === undefined) {
      setInternalIsActive(newActiveState);
    }

    // Call callbacks
    if (onToggle) {
      onToggle(newActiveState);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledButton $isActive={isActive} onClick={handleClick}>
      {text}
    </StyledButton>
  );
};

export default ToggleDefaultButton;
