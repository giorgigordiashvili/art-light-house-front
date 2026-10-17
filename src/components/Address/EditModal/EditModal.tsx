import React, { useState } from "react";
import styled from "styled-components";
import ModalOption from "./ModalOption";
import DividerLine from "@/components/MainPage/HeroAndCategory/DividerLine";
import { ecommerceClientAddressesDestroy } from "@/api/generated/api";

const StyledContainer = styled.div`
  position: absolute;
  top: 75px;
  right: 22px;
  width: 160px;
  min-height: 83px;
  border-radius: 10px;
  background-color: #242323;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  z-index: 999;
`;

const StyledError = styled.div`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 12px;
  line-height: 159%;
  text-align: center;
  color: #ff2626;
  padding: 0 12px 10px;
`;

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  addressId?: number;
  dictionary: any;
};

const EditModal = ({ onEdit, onDelete, addressId, dictionary }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDelete = async () => {
    if (addressId === undefined) return;
    try {
      setIsLoading(true);
      setError(false);
      await ecommerceClientAddressesDestroy(String(addressId));

      onDelete();
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
      <ModalOption text={dictionary.modalText1} color="white" onClick={onEdit} />
      {addressId !== undefined && (
        <>
          <DividerLine />
          <ModalOption
            text={isLoading ? (dictionary.deleting ?? "Deleting...") : dictionary.modalText2}
            color="red"
            onClick={isLoading ? undefined : handleDelete}
          />
          {error && (
            <StyledError role="alert">
              {dictionary.deleteError ?? "Could not delete the address"}
            </StyledError>
          )}
        </>
      )}
    </StyledContainer>
  );
};

export default EditModal;
