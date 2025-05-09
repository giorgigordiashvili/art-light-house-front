import React from "react";
import styled from "styled-components";
import ModalInput from "@/components/Header/ModalInput";
import InputTitle from "@/components/Header/InputTitle";
import SaveButton from "@/ProfileButton/Save";
import CancelButton from "@/ProfileButton/Cancel";

const StyledContainer = styled.div`
  width: 508px;
  height: 648px;
  background-color: #1c1c1c;
  border-radius: 20px;
`;

type Props = {};

const AddressModal = (props: Props) => {
  return (
    <StyledContainer>
      <CancelButton />
      <SaveButton />
    </StyledContainer>
  );
};

export default AddressModal;
