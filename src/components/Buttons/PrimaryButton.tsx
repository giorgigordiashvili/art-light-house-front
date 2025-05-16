import React from "react";
import styled, { css } from "styled-components";

type Props = {
  text: string;
  width?: string;
  height?: string;
  onClick?: () => void;
  media?: "yes" | "no" | "full";
  disabled?: boolean;
  card?: boolean;
};

const StyledContainer = styled.div<{ media?: "yes" | "no" | "full" }>`
  ${(props) =>
    props.media === "full" &&
    css`
      @media (max-width: 1080px) {
        width: 100%;
      }
    `}
`;

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "card",
})<{
  width?: string;
  height?: string;
  media?: "yes" | "no" | "full";
  disabled?: boolean;
  card?: boolean;
}>`
  height: ${(props) => props.height || "50px"};
  width: ${(props) => props.width || "252px"};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.disabled ? "#999999" : "#ffcb40")};
  border: none;
  border-radius: 10px;
  font-family: HelRom;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  transition: all 0.2s ease;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  color: #000;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  &:hover {
    color: ${(props) => (props.disabled ? "#000" : "#fff")};
  }

  ${(props) =>
    props.media !== "no" &&
    css`
      @media (max-width: 1080px) {
        width: 100%;
      }
    `}

  ${(props) =>
    props.card &&
    css`
      @media (max-width: 1080px) {
        width: 130px !important;
        height: 35px !important;
      }
    `}
`;

const PrimaryButton = ({ text, width, height, onClick, media, disabled, card }: Props) => {
  return (
    <StyledContainer media={media}>
      <StyledButton
        width={width}
        height={height}
        onClick={onClick}
        media={media}
        disabled={disabled}
        card={card}
      >
        {text}
      </StyledButton>
    </StyledContainer>
  );
};

export default PrimaryButton;
