import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { PaymentMethodData } from "@/types";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: #1c1c1c;
  border-radius: 20px;
  padding: 32px 24px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;

  @media (max-width: 1080px) {
    max-width: 90vw;
    padding: 24px 16px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 20px;
  color: #ffffff;
  margin: 0;

  @media (max-width: 1080px) {
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardItem = styled.div<{ $isSelected: boolean }>`
  background: ${({ $isSelected }) => ($isSelected ? "#2a2a2a" : "#1a1a1a")};
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "#ffcb40" : "#ffffff17")};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: #ffcb40;
    background: #2a2a2a;
  }
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 14px;
  color: #ffffff;
`;

const CardNumber = styled.span`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 13px;
  color: #cccccc;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #777;
  font-family: Helvetica;
  font-size: 14px;
`;

function getCardLogo(cardType: string) {
  switch (cardType) {
    case "visa":
      return "/assets/visa-logo.svg";
    case "mastercard":
      return "/assets/mastercard-logo.svg";
    case "amex":
      return "/assets/amex-logo.svg";
    default:
      return "/assets/paymentIcon.svg";
  }
}

function getCardTypeName(cardType: string, dictionary?: any) {
  switch (cardType) {
    case "visa":
      return dictionary?.cardTypeVisa || "Visa";
    case "mastercard":
      return dictionary?.cardTypeMastercard || "Mastercard";
    case "amex":
      return dictionary?.cardTypeAmex || "Amex";
    default:
      return dictionary?.cardTitle2 || "Card";
  }
}

function maskNumber(pm: PaymentMethodData) {
  const last4 = pm.lastFourDigits || pm.cardNumber.slice(-4);
  return `✲✲✲✲ ✲✲✲✲ ✲✲✲✲  ${last4}`;
}

type Props = {
  cards: PaymentMethodData[];
  currentCardId: string | null;
  onSelect: (pm: PaymentMethodData) => void;
  onClose: () => void;
  dictionary?: any;
};

const PaymentMethodSelectionModal = ({
  cards,
  currentCardId,
  onSelect,
  onClose,
  dictionary,
}: Props) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{dictionary?.selectPaymentMethod || "გადახდის ბარათის არჩევა"}</ModalTitle>
          <CloseButton onClick={onClose}>
            <Image src="/assets/xClose.svg" alt="close" width={16} height={16} />
          </CloseButton>
        </ModalHeader>

        {cards.length === 0 ? (
          <EmptyState>{dictionary?.noCards || "ბარათები ვერ მოიძებნა"}</EmptyState>
        ) : (
          <CardsList>
            {cards.map((pm) => (
              <CardItem
                key={pm.id}
                $isSelected={pm.id === currentCardId}
                onClick={() => onSelect(pm)}
              >
                <Image src={getCardLogo(pm.cardType)} alt={pm.cardType} width={48} height={32} />
                <CardInfo>
                  <CardTitle>{getCardTypeName(pm.cardType, dictionary)}</CardTitle>
                  <CardNumber>{maskNumber(pm)}</CardNumber>
                </CardInfo>
              </CardItem>
            ))}
          </CardsList>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default PaymentMethodSelectionModal;
