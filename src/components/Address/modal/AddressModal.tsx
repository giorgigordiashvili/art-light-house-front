import React from "react";
import styled from "styled-components";
import ModalInput from "@/components/Header/ModalInput";
import InputTitle from "@/components/Header/InputTitle";
import SaveButton from "@/ProfileButton/Save";
import CancelButton from "@/ProfileButton/Cancel";
import PlaceSelector from "./PlaceSelector";
import ModalTitle from "./ModalTitle";
import GoogleMap from "@/components/Contact/GoogleMap";

const StyledContainer = styled.div`
  width: 508px;
  height: 648px;
  background-color: #1c1c1c;
  border-radius: 20px;
  padding: 32px 24px 24px 24px;
`;

const StyledSelector = styled.div`
  margin-top: 42px;
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
`;

type Props = {};

const AddressModal = (props: Props) => {
  return (
    <StyledContainer>
      <ModalTitle text="მისამართის დამატება" />
      <StyledSelector>
        <PlaceSelector />
      </StyledSelector>
      <StyledInputWrapper>
        <InputTitle text="შეიყვანეთ მისამართი" />
        <ModalInput placeholder="ქუჩა და ნომერი" />
      </StyledInputWrapper>
      <StyledInputWrapper>
        <InputTitle text="დაამატებითი ინფორმაცია" />
        <ModalInput placeholder="მაგ: სადარბაზო 2, სართული 4, ბინა 17" />
      </StyledInputWrapper>
      <StyledMap>
        <GoogleMap variant={2} />
      </StyledMap>
      <StyledButton>
        <CancelButton />
        <SaveButton />
      </StyledButton>
    </StyledContainer>
  );
};

export default AddressModal;
