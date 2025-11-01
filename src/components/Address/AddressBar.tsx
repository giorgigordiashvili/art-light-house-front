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

const SkeletonAddressCard = styled.div`
  width: 100%;
  height: 130px;
  border-radius: 12px;
  border: 1px solid #ffffff12;
  background: rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
    z-index: 1;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @media (max-width: 1080px) {
    height: 120px;
  }
`;

const SkeletonContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonTitle = styled.div`
  width: 50%;
  height: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const SkeletonText = styled.div`
  width: 80%;
  height: 14px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;

  &:nth-child(3) {
    width: 60%;
  }

  &:nth-child(4) {
    width: 70%;
  }
`;

type Props = {
  onOpenModal: () => void;
  addresses: AddressData[];
  onEditAddress: (address: AddressData) => void;
  onDeleteAddress: (address: AddressData) => void;
  dictionary: any;
  loading?: boolean;
};

const AddressBar = ({
  onOpenModal,
  addresses,
  onEditAddress,
  onDeleteAddress,
  dictionary,
  loading = false,
}: Props) => (
  <StyledContainer>
    <AddressTitle text={dictionary.title} />
    <DividerLine />
    <StyledCardsWrapper>
      {loading ? (
        <>
          {[1, 2, 3, 4].map((index) => (
            <SkeletonAddressCard key={index}>
              <SkeletonContent>
                <SkeletonTitle />
                <SkeletonText />
                <SkeletonText />
                <SkeletonText />
              </SkeletonContent>
            </SkeletonAddressCard>
          ))}
        </>
      ) : (
        <>
          <AddressCard onOpenModal={onOpenModal} dictionary={dictionary} />
          {addresses.map((item) => (
            <AddedAddressCard
              key={item.id || `${item.place}-${item.address}`}
              data={item}
              onEditAddress={() => onEditAddress(item)}
              onDeleteAddress={() => onDeleteAddress(item)}
              dictionary={dictionary}
            />
          ))}
        </>
      )}
    </StyledCardsWrapper>
  </StyledContainer>
);

export default AddressBar;
