import React from "react";
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
}: Props) => {
  const hasIcon = Boolean(iconSrc);

  return (
    <StyledContainer $hasIcon={hasIcon}>
      <input type={type} placeholder={placeholder} onChange={onChange} value={value} name={name} />
      {iconSrc && (
        <StyledIconWrapper>
          <Image src={iconSrc} alt={iconAlt} width={iconSize} height={iconSize} />
        </StyledIconWrapper>
      )}
    </StyledContainer>
  );
};

export default ModalInput;
