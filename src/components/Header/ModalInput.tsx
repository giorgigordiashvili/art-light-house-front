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
    cursor: pointer;

    ${({ $hasIcon }) => $hasIcon && `padding-right: 48px;`}

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
};

const ModalInput = ({ placeholder, iconSrc, iconAlt = "input icon", iconSize = 20 }: Props) => {
  const hasIcon = Boolean(iconSrc);

  return (
    <StyledContainer $hasIcon={hasIcon}>
      <input type="text" placeholder={placeholder} />
      {iconSrc && (
        <StyledIconWrapper>
          <Image src={iconSrc} alt={iconAlt} width={iconSize} height={iconSize} />
        </StyledIconWrapper>
      )}
    </StyledContainer>
  );
};

export default ModalInput;
