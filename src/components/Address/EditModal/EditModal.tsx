import React from "react";
import styled from "styled-components";
import ModalOption from "./ModalOption";
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
  onClose: () => void;
  onEdit: () => void;
};

const EditModal = ({ onClose, onEdit }: Props) => {
  return (
    <StyledContainer>
      <ModalOption text="რედაქტირება" color="white" onClick={onEdit} />
      <DividerLine />
      <ModalOption text="წაშლა" color="red" onClick={onClose} />
    </StyledContainer>
  );
};

export default EditModal;
