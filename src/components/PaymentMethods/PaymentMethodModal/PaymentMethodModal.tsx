import React, { useState } from "react";
import styled from "styled-components";
import ModalInput from "@/components/Header/ModalInput";
import InputTitle from "@/components/Header/InputTitle";
import SaveButton from "@/ProfileButton/Save";
import CancelButton from "@/ProfileButton/Cancel";
import CardTypeSelector from "./CardTypeSelector";
import ModalTitle from "../../Address/AddressModal/ModalTitle";
import { PaymentMethodData } from "@/types";

const StyledContainer = styled.div`
  width: 508px;
  height: auto;
  background-color: #1c1c1c;
  border-radius: 20px;
  padding: 32px 24px 24px 24px;
  @media (max-width: 1080px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 20px 16px 63px 16px;
  }
`;

const StyledSelector = styled.div`
  margin-top: 42px;
  @media (max-width: 1080px) {
    padding-inline: 4px;
  }
`;

const StyledInputWrapper = styled.div`
  margin-top: 20px;
`;

const StyledButton = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  @media (max-width: 1080px) {
    flex-direction: column-reverse;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 14px;
  margin-top: 8px;
  font-family: Helvetica;
`;

const MaskedInput = styled(ModalInput)`
  letter-spacing: 2px;
`;

type Props = {
  onClose: () => void;
  onSave: (paymentMethod: PaymentMethodData) => void;
  initialData?: PaymentMethodData;
  dictionary: any;
};

const PaymentMethodModal = ({ onClose, onSave, initialData, dictionary }: Props) => {
  const [selectedCardType, setSelectedCardType] = useState<"visa" | "mastercard" | "amex">(
    initialData?.cardType || "visa"
  );
  const [cardNumber, setCardNumber] = useState(initialData?.cardNumber || "");
  const [cvv, setCvv] = useState(initialData?.cvv || "");
  const [error, setError] = useState<string | null>(null);

  // Format card number with spaces every 4 digits and mask with dots
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Limit to 12 digits
    const limited = digitsOnly.slice(0, 12);

    // Add spaces every 4 characters
    const formatted = limited.replace(/(\d{4})(?=\d)/g, "$1 ");

    return formatted;
  };

  // Mask card number with dots except for display
  const maskCardNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    const masked = digitsOnly.replace(/\d/g, "•");
    return masked.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length <= 12) {
      setCardNumber(digitsOnly);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSave = () => {
    setError(null);

    // Validate card number (12 digits)
    if (cardNumber.length !== 12) {
      setError(dictionary.cardNumberError);
      return;
    }

    // Validate CVV (4 digits)
    if (cvv.length !== 4) {
      setError(dictionary.cvvError);
      return;
    }

    const paymentMethod: PaymentMethodData = {
      id: initialData?.id,
      cardType: selectedCardType,
      cardNumber,
      cvv,
      lastFourDigits: cardNumber.slice(-4),
    };

    onSave(paymentMethod);
  };

  // Display value with masking
  const displayCardNumber = cardNumber ? maskCardNumber(formatCardNumber(cardNumber)) : "";

  return (
    <StyledContainer>
      <ModalTitle text={dictionary.modalTitle} />
      <StyledSelector>
        <InputTitle text={dictionary.cardTypeLabel} />
        <CardTypeSelector
          selectedCardType={selectedCardType}
          onSelect={setSelectedCardType}
          dictionary={dictionary}
        />
      </StyledSelector>
      <StyledInputWrapper>
        <InputTitle text={dictionary.inputTitle1} />
        <MaskedInput
          placeholder={dictionary.placeholder1}
          value={displayCardNumber}
          onChange={handleCardNumberChange}
          type="text"
        />
      </StyledInputWrapper>
      <StyledInputWrapper>
        <InputTitle text={dictionary.inputTitle2} />
        <ModalInput
          placeholder={dictionary.placeholder2}
          value={cvv.replace(/\d/g, "•")}
          onChange={handleCvvChange}
          type="text"
        />
      </StyledInputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <StyledButton>
        <CancelButton onClick={onClose} dictionary={dictionary} />
        <SaveButton onClick={handleSave} dictionary={dictionary} />
      </StyledButton>
    </StyledContainer>
  );
};

export default PaymentMethodModal;
