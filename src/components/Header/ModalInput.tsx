import React, { useState, useRef } from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledContainer = styled.div<{ $hasIcon: boolean }>`
  position: relative;
  margin-top: 12px;

  input {
    width: 460px;
    height: 50px;
    border: 1px solid #ffffff12;
    border-radius: 10px;
    padding: 0 16px;
    font-size: 16px;
    background-color: #2a2a2a96;
    color: #fafafa;
    outline: none;

    ${({ $hasIcon }) => $hasIcon && `padding-right: 48px;`}

    &::placeholder {
      font-weight: 400;
      font-size: 12px;
      line-height: 28px;
      letter-spacing: 0%;
      color: #919191;
      opacity: 0.6;
      font-family: Helvetica;
    }

    /* Hide native date picker indicator and style for custom calendar icon */
    &[type="date"]::-webkit-calendar-picker-indicator {
      opacity: 0;
      position: absolute;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    &[type="date"]::-moz-calendar-picker-indicator {
      opacity: 0;
    }

    @media (max-width: 1080px) {
      width: 100%;
    }
  }
`;

const StyledIconWrapper = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 1;
`;

type Props = {
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  iconSize?: number;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  isPasswordField?: boolean;
  isDateField?: boolean;
};

const ModalInput = ({
  placeholder,
  iconSrc,
  iconAlt = "input icon",
  iconSize = 20,
  type = "text",
  onChange,
  value,
  name,
  isPasswordField = false,
  isDateField = false,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Determine the actual input type based on password visibility and provided type
  let inputType = type;
  if (isPasswordField) {
    inputType = showPassword ? "text" : "password";
  }

  // Determine which icon to show for password fields
  const displayIcon = isPasswordField
    ? showPassword
      ? "/assets/icons/eye-off.png"
      : "/assets/eye.svg"
    : iconSrc;

  const displayDateIcon = isDateField ? "/assets/icons/calendar.png" : null;

  const hasIcon = Boolean(displayIcon || displayDateIcon);

  const handleIconClick = () => {
    if (isPasswordField) {
      setShowPassword(!showPassword);
    } else if (isDateField && dateInputRef.current) {
      // Trigger the date picker when calendar icon is clicked
      try {
        dateInputRef.current.showPicker?.();
      } catch {
        // Fallback: focus the input if showPicker is not supported
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <StyledContainer $hasIcon={hasIcon}>
      <input
        ref={isDateField ? dateInputRef : undefined}
        type={inputType}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        name={name}
      />
      {displayIcon && (
        <StyledIconWrapper onClick={handleIconClick}>
          <Image src={displayIcon} alt={iconAlt} width={iconSize} height={iconSize} />
        </StyledIconWrapper>
      )}
      {displayDateIcon && (
        <StyledIconWrapper onClick={handleIconClick}>
          <Image src={displayDateIcon} alt={iconAlt} width={iconSize} height={iconSize} />
        </StyledIconWrapper>
      )}
    </StyledContainer>
  );
};

export default ModalInput;
