import React, { useState } from "react";
import styled from "styled-components";
import ModalOption from "./ModalOption";
import DividerLine from "@/components/MainPage/HeroAndCategory/DividerLine";
import { apiEcommerceClientAddressesDestroy } from "@/api/generated/api";

const StyledContainer = styled.div`
  position: absolute;
  top: 75px;
  right: 22px;
  width: 160px;
  height: 83px;
  border-radius: 10px;
  background-color: #242323;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  z-index: 999;
`;

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  addressId: number;
  dictionary: any;
};

const EditModal = ({ onEdit, onDelete, addressId, dictionary }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await apiEcommerceClientAddressesDestroy(String(addressId));

      onDelete();
    } catch {
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
      <ModalOption text={dictionary.modalText1} color="white" onClick={onEdit} />
      <DividerLine />
      <ModalOption
        text={isLoading ? "Deleting..." : dictionary.modalText2}
        color="red"
        onClick={isLoading ? undefined : handleDelete}
      />
    </StyledContainer>
  );
};

export default EditModal;
