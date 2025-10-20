import React, { useState } from "react";
import styled from "styled-components";

type Props = {
  onClick?: () => void;
  isActive?: boolean;
  onToggle?: (isActive: boolean) => void;
  dictionary?: any;
};

type StyledProps = {
  $isActive: boolean;
};

const StyledButton = styled.div<StyledProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ffcb401a;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: ${(props) => (props.$isActive ? "#000000" : "#ffcb40")};
  border-radius: 10px;
  background-color: ${(props) => (props.$isActive ? "#ffcb40" : "#1c1c1c")};
  width: 150px;
  &:hover {
    color: ${(props) => (props.$isActive ? "#000000" : "#fbe4a7")};
  }

  @media (max-width: 1080px) {
    width: 100%;
    height: 48px;
  }

  &:hover {
    color: ${(props) => (props.$isActive ? "#000000" : "#fbe4a7")};
  }
`;

const StyledText = styled.p<StyledProps>`
  max-width: 120px;
  font-family: Helvetica;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0%;
`;

const ToggleDefaultButton = ({
  dictionary,
  onClick,
  isActive: controlledIsActive,
  onToggle,
}: Props) => {
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
      <StyledText $isActive={isActive}>{dictionary?.button3 || "default location"}</StyledText>
    </StyledButton>
  );
};

export default ToggleDefaultButton;
