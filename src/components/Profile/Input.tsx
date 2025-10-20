"use client";
import styled from "styled-components";
import Image from "next/image";
import { useState, useRef } from "react";

interface InputWithLabelProps {
  label: string;
  placeholder?: string;
  icon?: string;
  gap?: number;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  readOnly?: boolean;
  isPasswordField?: boolean;
}

const Wrapper = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => ($gap ? `${$gap}px` : "12px")};
  width: 364px;

  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: #fafafa;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  width: 100%;
  background: #1a1a1a96;
  border-radius: 10px;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  padding: 11px 18px;
`;

const StyledIcon = styled(Image)`
  margin-right: 14px;
  flex-shrink: 0;
`;

const StyledInput = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #777;
  }

  /* Hide native date picker indicator for custom calendar icon */
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
`;

const ToggleIcon = styled(Image)`
  margin-left: 12px;
  cursor: pointer;
  flex-shrink: 0;
`;

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  placeholder,
  icon,
  gap,
  value,
  onChange,
  type = "text",
  readOnly = false,
  isPasswordField = false,
}: InputWithLabelProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const isDateField = type === "date";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !readOnly) {
      onChange(e.target.value);
    }
  };

  const handleIconClick = () => {
    if (isPasswordField) {
      setShowPassword((prev) => !prev);
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

  const effectiveType = isPasswordField ? (showPassword ? "text" : "password") : type;
  const toggleSrc = showPassword ? "/assets/icons/eye-off.png" : "/assets/eye.svg";
  const toggleAlt = showPassword ? "Hide password" : "Show password";

  // Use white calendar icon for date fields
  const displayIcon = isDateField ? "/assets/icons/calendar.png" : icon;

  return (
    <Wrapper $gap={gap}>
      <Label>{label}</Label>
      <InputWrapper>
        {displayIcon && <StyledIcon src={displayIcon} alt="icon" width={24} height={24} />}
        <StyledInput
          ref={isDateField ? dateInputRef : undefined}
          placeholder={placeholder}
          value={value || ""}
          onChange={handleInputChange}
          type={effectiveType}
          readOnly={readOnly}
        />
        {isPasswordField && !readOnly && (
          <ToggleIcon
            src={toggleSrc}
            alt={toggleAlt}
            width={20}
            height={20}
            onClick={handleIconClick}
            title={toggleAlt}
          />
        )}
        {isDateField && (
          <ToggleIcon
            src="/assets/icons/calendar.png"
            alt="calendar"
            width={20}
            height={20}
            onClick={handleIconClick}
            title="Select date"
          />
        )}
      </InputWrapper>
    </Wrapper>
  );
};

export default InputWithLabel;
