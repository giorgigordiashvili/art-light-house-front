import React, { useState } from "react";
import styled from "styled-components";
import ModalInput from "@/components/Header/ModalInput";
import InputTitle from "@/components/Header/InputTitle";
import SaveButton from "@/ProfileButton/Save";
import CancelButton from "@/ProfileButton/Cancel";
import PlaceSelector from "./PlaceSelector";
import ModalTitle from "./ModalTitle";
import GoogleMap from "@/components/Contact/GoogleMap";
import { AddressData } from "@/types";

const StyledContainer = styled.div`
  width: 508px;
  height: 648px;
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

const StyledMap = styled.div`
  margin-top: 20px;
`;

const StyledButton = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  @media (max-width: 1080px) {
    flex-direction: column-reverse;
  }
`;

type Props = {};

const AddressModal = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: AddressData) => void;
}) => {
  const [selectedPlace, setSelectedPlace] = useState("სახლი");
  const [address, setAddress] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleSave = () => {
    onSave({ place: selectedPlace, address, additionalInfo });
    onClose();
  };

  return (
    <StyledContainer>
      <ModalTitle text="მისამართის დამატება" />
      <StyledSelector>
        <PlaceSelector selectedPlace={selectedPlace} onSelect={setSelectedPlace} />
      </StyledSelector>
      <StyledInputWrapper>
        <InputTitle text="შეიყვანეთ მისამართი" />
        <ModalInput
          placeholder="ქუჩა და ნომერი"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </StyledInputWrapper>
      <StyledInputWrapper>
        <InputTitle text="დამატებითი ინფორმაცია" />
        <ModalInput
          placeholder="მაგ: სადარბაზო 2, სართული 4, ბინა 17"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </StyledInputWrapper>
      <StyledMap>
        <GoogleMap variant={2} />
      </StyledMap>
      <StyledButton>
        <CancelButton onClick={onClose} />
        <SaveButton onClick={handleSave} />
      </StyledButton>
    </StyledContainer>
  );
};

export default AddressModal;
