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

const InlineRow = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const SmallModalInput = styled(ModalInput)`
  input {
    width: 100%;
  }
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
  const [expiry, setExpiry] = useState(initialData?.expiry || ""); // digits only MMYY
  const [error, setError] = useState<string | null>(null);

  // Mask helpers
  const maskCardNumber = (digits: string) => {
    // Create bullets same length as digits, then insert space after every 4 chars
    return "•".repeat(digits.length).replace(/(.{4})(?=.)/g, "$1 ");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nativeEvt = e.nativeEvent as any;

    // Handle backspace
    if ((nativeEvt as any)?.inputType === "deleteContentBackward") {
      setCardNumber((prev) => prev.slice(0, -1));
      return;
    }

    // Handle normal digit insert
    const data = nativeEvt?.data as string | null;
    if (data && /\d/.test(data)) {
      setCardNumber((prev) => (prev + data).slice(0, 16));
      return;
    }

    // Ignore other non-digit changes coming from masking
  };

  // Pasting is not explicitly handled because ModalInput does not expose onPaste prop.
  // Users can still type digits; if needed, we can extend ModalInput later to support paste.

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nativeEvt = e.nativeEvent as any;

    if ((nativeEvt as any)?.inputType === "deleteContentBackward") {
      setCvv((prev) => prev.slice(0, -1));
      return;
    }

    const data = nativeEvt?.data as string | null;
    if (data && /\d/.test(data)) {
      setCvv((prev) => (prev + data).slice(0, 3));
      return;
    }
  };

  // See note above about paste handling.

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Accept digits only, max 4 (MMYY)
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setExpiry(digits);
  };

  const handleSave = () => {
    setError(null);

    // Validate card number (16 digits)
    if (cardNumber.length !== 16) {
      setError(dictionary.cardNumberError);
      return;
    }

    // Validate CVV (3 digits)
    if (cvv.length !== 3) {
      setError(dictionary.cvvError);
      return;
    }

    const paymentMethod: PaymentMethodData = {
      id: initialData?.id,
      cardType: selectedCardType,
      cardNumber,
      cvv,
      expiry,
      lastFourDigits: cardNumber.slice(-4),
    };

    onSave(paymentMethod);
  };

  // Display value with masking
  const displayCardNumber = cardNumber ? maskCardNumber(cardNumber) : "";
  const formattedExpiry = expiry
    ? expiry.length <= 2
      ? expiry
      : `${expiry.slice(0, 2)}/${expiry.slice(2)}`
    : "";

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
          fullWidth
        />
      </StyledInputWrapper>
      <StyledInputWrapper>
        <InlineRow>
          <div style={{ flex: 1 }}>
            <InputTitle text={dictionary.inputTitle3 || "Expiration Date"} />
            <SmallModalInput
              placeholder={dictionary.placeholder3 || "MM/YY"}
              value={formattedExpiry}
              onChange={handleExpiryChange}
              type="text"
              fullWidth
            />
          </div>
          <div style={{ flex: 1 }}>
            <InputTitle text={dictionary.inputTitle2} />
            <SmallModalInput
              placeholder={dictionary.placeholder2}
              value={cvv.replace(/\d/g, "•")}
              onChange={handleCvvChange}
              type="text"
              fullWidth
            />
          </div>
        </InlineRow>
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
