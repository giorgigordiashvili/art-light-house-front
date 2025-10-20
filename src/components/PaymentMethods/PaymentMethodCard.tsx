import React from "react";
import styled from "styled-components";
import AddIcon from "../../components/Address/AddIcon";

const StyledCard = styled.div`
  width: 367px;
  height: 100px;
  background-color: #2a2a2a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  border-radius: 10px;
  padding: 26px 0 26px 26px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #252525;
    border-color: #ffffff45;
  }

  @media (max-width: 1080px) {
    width: 100%;
    height: 111px;
  }
`;

const StyledTitle = styled.h3`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 13px;
  line-height: 21.86px;
  color: #ffffff;
`;

type Props = {
  onOpenModal: () => void;
  dictionary: any;
};

const PaymentMethodCard = ({ onOpenModal, dictionary }: Props) => (
  <StyledCard onClick={onOpenModal}>
    <AddIcon />
    <StyledTitle>{dictionary.cardTitle1}</StyledTitle>
  </StyledCard>
);

export default PaymentMethodCard;
