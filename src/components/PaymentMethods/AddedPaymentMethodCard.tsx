import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { PaymentMethodData } from "@/types";
import EditModal from "./EditModal/EditModal";

const StyledCard = styled.div`
  background-color: #1a1a1a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  border-radius: 10px;
  width: 364px;
  height: 100px;
  padding: 21px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background-color: #252525;
    border-color: #ffffff29;
  }

  @media (max-width: 1080px) {
    width: 100%;
    height: 111px;
    padding: 15px 16px;
  }
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CardTypeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardTypeImage = styled(Image)`
  border-radius: 4px;
`;

const CardTitle = styled.h3`
  font-family: Helvetica;
  font-weight: 550;
  font-size: 16px;
  line-height: 21.86px;
  color: #ffffff;
  @media (max-width: 1080px) {
    font-size: 14px;
    line-height: 19.12px;
  }
`;

const DotsButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ffd700;
  }
`;

const CardNumber = styled.p`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.12px;
  color: #bcbcbc;
  margin: 0;
  letter-spacing: 2px;
  @media (max-width: 1080px) {
    font-size: 12px;
    line-height: 16.39px;
  }
`;

type Props = {
  data: PaymentMethodData;
  onEditPaymentMethod: () => void;
  onDeletePaymentMethod: () => void;
  dictionary: any;
};

const getCardLogo = (cardType: string) => {
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
};

const getCardTypeName = (cardType: string, dictionary: any) => {
  switch (cardType) {
    case "visa":
      return dictionary.cardTypeVisa;
    case "mastercard":
      return dictionary.cardTypeMastercard;
    case "amex":
      return dictionary.cardTypeAmex;
    default:
      return dictionary.cardTitle2;
  }
};

const AddedPaymentMethodCard = ({
  data,
  onEditPaymentMethod,
  onDeletePaymentMethod,
  dictionary,
}: Props) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDotsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleEdit = () => {
    setIsEditModalOpen(false);
    onEditPaymentMethod();
  };

  const handleDelete = () => {
    setIsEditModalOpen(false);
    onDeletePaymentMethod();
  };

  // Format card number to show last 4 digits
  const maskedCardNumber = `•••• •••• •••• ${data.lastFourDigits || data.cardNumber.slice(-4)}`;

  return (
    <StyledCard>
      <TopSection>
        <CardTypeSection>
          <CardTypeImage
            src={getCardLogo(data.cardType)}
            alt={data.cardType}
            width={48}
            height={32}
          />
          <CardTitle>{getCardTypeName(data.cardType, dictionary)}</CardTitle>
        </CardTypeSection>
        <DotsButton onClick={handleDotsClick}>⋮</DotsButton>
      </TopSection>
      <CardNumber>{maskedCardNumber}</CardNumber>

      {isEditModalOpen && (
        <EditModal
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setIsEditModalOpen(false)}
          dictionary={dictionary}
        />
      )}
    </StyledCard>
  );
};

export default AddedPaymentMethodCard;
