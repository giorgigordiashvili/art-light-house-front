import React from "react";
import styled from "styled-components";
import AddressCard from "./AddressCard";
import AddressTitle from "./AddressTitle";
import DividerLine from "../MainPage/HeroAndCategory/DividerLine";
import AddedAddressCard from "./AddedAddressCard";
import { AddressData } from "@/types";

const StyledContainer = styled.div`
  background-color: #1a1a1a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  border-radius: 17px;
  width: 800px;
  height: 544px;
  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 22px 24px 24px 24px;
  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column;
    padding: 22px 16px 24px 16px;
  }
`;

type Props = {
  onOpenModal: () => void;
};

const AddressBar = ({
  onOpenModal,
  addresses,
}: {
  onOpenModal: () => void;
  addresses: AddressData[];
}) => (
  <StyledContainer>
    <AddressTitle text="ჩემი მისამართები" />
    <DividerLine />
    <StyledCardsWrapper>
      <AddressCard onOpenModal={onOpenModal} />
      {addresses.map((item, index) => (
        <AddedAddressCard key={index} data={item} />
      ))}
    </StyledCardsWrapper>
  </StyledContainer>
);

export default AddressBar;
