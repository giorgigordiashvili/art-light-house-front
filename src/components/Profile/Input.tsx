"use client";
import styled from "styled-components";
import Image from "next/image";

interface InputWithLabelProps {
  label: string;
  placeholder?: string;
  icon?: string;
  gap?: number; // ახალი prop
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
`;

const InputWithLabel = ({ label, placeholder, icon, gap }: InputWithLabelProps) => {
  return (
    <Wrapper $gap={gap}>
      <Label>{label}</Label>
      <InputWrapper>
        {icon && <StyledIcon src={icon} alt="icon" width={24} height={24} />}
        <StyledInput placeholder={placeholder} />
      </InputWrapper>
    </Wrapper>
  );
};

export default InputWithLabel;
