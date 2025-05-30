import React from "react";
import styled from "styled-components";
import AddIcon from "./AddIcon";

const StyledContainer = styled.div`
  width: 367px;
  height: 100px;
  background-color: #2a2a2a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  border-radius: 10px;
  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const StyledIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 26px 0 26px 26px;
  cursor: pointer;
  @media (max-width: 1080px) {
    padding: 26px 0 26px 16px;
    gap: 13px;
  }
`;

const StyledTitle = styled.p`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 13px;
  line-height: 159%;
  color: #ffffff;
`;

type Props = {
  onOpenModal: () => void;
  dictionary: any;
};

const AddressCard = ({ onOpenModal, dictionary }: Props) => {
  return (
    <StyledContainer>
      <StyledIcon onClick={onOpenModal}>
        <AddIcon />
        <StyledTitle>{dictionary.cardTitle1}</StyledTitle>
      </StyledIcon>
    </StyledContainer>
  );
};

export default AddressCard;
