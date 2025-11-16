import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { ClientAddress } from "@/api/generated/interfaces";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: #1c1c1c;
  border-radius: 20px;
  padding: 32px 24px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;

  @media (max-width: 1080px) {
    max-width: 90vw;
    padding: 24px 16px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 20px;
  color: #ffffff;
  margin: 0;

  @media (max-width: 1080px) {
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AddressItem = styled.div<{ $isSelected: boolean }>`
  background: ${({ $isSelected }) => ($isSelected ? "#2a2a2a" : "#1a1a1a")};
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "#ffcb40" : "#ffffff17")};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &:hover {
    border-color: #ffcb40;
    background: #2a2a2a;
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ffffff1a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AddressInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AddressType = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 14px;
  color: #ffffff;
`;

const AddressText = styled.span`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 13px;
  color: #cccccc;
  line-height: 1.4;
`;

const DefaultBadge = styled.span`
  display: inline-block;
  background: #ffcb40;
  color: #000000;
  font-family: Helvetica;
  font-weight: 500;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #777;
  font-family: Helvetica;
  font-size: 14px;
`;

type Props = {
  addresses: ClientAddress[];
  currentAddressId: number | null;
  onSelect: (address: ClientAddress) => void;
  onClose: () => void;
  dictionary?: any;
};

const getAddressTypeIcon = (type?: string) => {
  switch (type) {
    case "work":
      return "/assets/icons/job.svg";
    case "home":
      return "/assets/home.svg";
    default:
      return "/assets/addressIcon.svg";
  }
};

const getAddressTypeName = (type?: string, dictionary?: any) => {
  switch (type) {
    case "work":
      return dictionary?.addressTypeWork || "სამსახური";
    case "home":
      return dictionary?.addressTypeHome || "სახლი";
    default:
      return dictionary?.addressTypeOther || "სხვა";
  }
};

const AddressSelectionModal = ({
  addresses,
  currentAddressId,
  onSelect,
  onClose,
  dictionary,
}: Props) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{dictionary?.selectAddress || "მისამართის არჩევა"}</ModalTitle>
          <CloseButton onClick={onClose}>
            <Image src="/assets/xClose.svg" alt="close" width={16} height={16} />
          </CloseButton>
        </ModalHeader>

        {addresses.length === 0 ? (
          <EmptyState>{dictionary?.noAddresses || "მისამართები არ მოიძებნა"}</EmptyState>
        ) : (
          <AddressList>
            {addresses.map((address) => (
              <AddressItem
                key={address.id}
                $isSelected={address.id === currentAddressId}
                onClick={() => onSelect(address)}
              >
                <IconWrapper>
                  <Image
                    src={getAddressTypeIcon(address.label as any)}
                    alt="address icon"
                    width={20}
                    height={20}
                  />
                </IconWrapper>
                <AddressInfo>
                  <AddressType>{getAddressTypeName(address.label as any, dictionary)}</AddressType>
                  <AddressText>
                    {address.address}
                    {address.city ? `, ${address.city}` : ""}
                  </AddressText>
                  {address.extra_instructions && (
                    <AddressText style={{ fontSize: "12px", color: "#999" }}>
                      {address.extra_instructions}
                    </AddressText>
                  )}
                  {address.is_default && (
                    <DefaultBadge>{dictionary?.defaultAddress || "ძირითადი"}</DefaultBadge>
                  )}
                </AddressInfo>
              </AddressItem>
            ))}
          </AddressList>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default AddressSelectionModal;
