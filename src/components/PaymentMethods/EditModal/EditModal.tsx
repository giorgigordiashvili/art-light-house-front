import React from "react";
import styled from "styled-components";
import ModalOption from "../../Address/EditModal/ModalOption";
import DividerLine from "@/components/MainPage/HeroAndCategory/DividerLine";

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
  onClose: () => void;
  dictionary: any;
};

const EditModal = ({ onEdit, onDelete, dictionary }: Props) => {
  return (
    <StyledContainer onClick={(e) => e.stopPropagation()}>
      <ModalOption text={dictionary.modalText1} color="white" onClick={onEdit} />
      <DividerLine />
      <ModalOption text={dictionary.modalText2} color="red" onClick={onDelete} />
    </StyledContainer>
  );
};

export default EditModal;
