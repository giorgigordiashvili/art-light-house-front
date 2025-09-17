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
  z-index: 1;
  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  padding: 22px 24px 59px 24px;
  max-height: 363px;
  width: 800px;
  scrollbar-width: none;
  overflow: scroll;
  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column;
    padding: 22px 16px 24px 16px;
    width: auto;
  }
`;

type Props = {
  onOpenModal: () => void;
  addresses: AddressData[];
  onEditAddress: (address: AddressData) => void;
  dictionary: any;
};

const AddressBar = ({ onOpenModal, addresses, onEditAddress, dictionary }: Props) => (
  <StyledContainer>
    <AddressTitle text={dictionary.title} />
    <DividerLine />
    <StyledCardsWrapper>
      <AddressCard onOpenModal={onOpenModal} dictionary={dictionary} />
      {addresses.map((item) => (
        <AddedAddressCard
          key={item.id || `${item.place}-${item.address}`}
          data={item}
          onEditAddress={() => onEditAddress(item)}
          dictionary={dictionary}
        />
      ))}
    </StyledCardsWrapper>
  </StyledContainer>
);

export default AddressBar;
