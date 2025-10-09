import React from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  @media (max-width: 1080px) {
    gap: 8px;
  }
`;

const StyledCardOption = styled.div<{ isSelected: boolean }>`
  width: 156px;
  height: 100px;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.isSelected ? "#ffd700" : "#ffffff29")};
  background-color: ${(props) => (props.isSelected ? "#2a2a2a" : "#1a1a1a")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => (props.isSelected ? "#ffd700" : "#ffffff45")};
    background-color: #2a2a2a;
  }

  @media (max-width: 1080px) {
    width: 100%;
    height: 90px;
  }
`;

const CardLabel = styled.p<{ isSelected: boolean }>`
  font-family: Helvetica Neue LT GEO;
  font-weight: ${(props) => (props.isSelected ? "700" : "400")};
  font-size: 14px;
  line-height: 19.12px;
  color: ${(props) => (props.isSelected ? "#ffd700" : "#ffffff")};
  margin: 0;
`;

type Props = {
  selectedCardType: "visa" | "mastercard" | "amex";
  onSelect: (cardType: "visa" | "mastercard" | "amex") => void;
  dictionary: any;
};

const CardTypeSelector = ({ selectedCardType, onSelect, dictionary }: Props) => {
  const cardTypes: Array<{ type: "visa" | "mastercard" | "amex"; logo: string; label: string }> = [
    { type: "visa", logo: "/assets/visa-logo.svg", label: dictionary.cardTypeVisa },
    {
      type: "mastercard",
      logo: "/assets/mastercard-logo.svg",
      label: dictionary.cardTypeMastercard,
    },
    { type: "amex", logo: "/assets/amex-logo.svg", label: dictionary.cardTypeAmex },
  ];

  return (
    <StyledContainer>
      {cardTypes.map((card) => (
        <StyledCardOption
          key={card.type}
          isSelected={selectedCardType === card.type}
          onClick={() => onSelect(card.type)}
        >
          <Image src={card.logo} alt={card.type} width={48} height={32} />
          <CardLabel isSelected={selectedCardType === card.type}>{card.label}</CardLabel>
        </StyledCardOption>
      ))}
    </StyledContainer>
  );
};

export default CardTypeSelector;
