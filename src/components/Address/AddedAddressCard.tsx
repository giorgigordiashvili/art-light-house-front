import React, { useState } from "react";
import styled from "styled-components";
import EditIcon from "./EditIcon";
import Image from "next/image";
import EditModal from "./EditModal/EditModal";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 62px;
  width: 367px;
  height: 100px;
  background-color: #2a2a2a96;
  border: 1px solid #ffffff12;
  border-radius: 10px;
  padding: 26px 23px 26px 26px;
  position: relative;
  @media (max-width: 1080px) {
    width: 100%;
    gap: 0;
    justify-content: space-between;
  }
`;

const StyledContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledPlace = styled.p`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 13px;
  color: #ffffff;
`;

const StyledAddress = styled.p`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 13px;
  color: #ffffff;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 170px;
  max-width: 170px;
`;

type AddressData = {
  id?: number;
  place: string;
  address: string;
  additionalInfo?: string;
  latitude?: string;
  longitude?: string;
  address_type?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
};

const getTranslatedPlace = (place: string, dictionary: any) => {
  switch (place) {
    case dictionary.cardTitle2:
      return dictionary.cardTitle2;
    case dictionary.cardTitle3:
      return dictionary.cardTitle3;
    case dictionary.cardTitle4:
      return dictionary.cardTitle4;
    default:
      return dictionary.cardTitle2;
  }
};

const AddedAddressCard = ({
  data,
  onEditAddress,
  onDeleteAddress,
  dictionary,
}: {
  data: AddressData;
  onEditAddress: () => void;
  onDeleteAddress: () => void;
  dictionary: any;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const iconMap: Record<string, string> = {
    [dictionary.cardTitle2]: "/assets/home.svg",
    [dictionary.cardTitle3]: "/assets/briefcase.svg",
    [dictionary.cardTitle4]: "/assets/pin.svg",
  };

  return (
    <StyledContainer>
      <StyledContent>
        <Image src={iconMap[data.place]} width={24} height={24} alt="icon" />
        <StyledTextWrapper>
          <StyledPlace>{getTranslatedPlace(data.place, dictionary)}</StyledPlace>
          <StyledAddress>{data.address}</StyledAddress>
        </StyledTextWrapper>
      </StyledContent>

      <EditIcon onClick={() => setIsEditModalOpen(!isEditModalOpen)} />

      {isEditModalOpen && (
        <EditModal
          onEdit={() => {
            setIsEditModalOpen(false);
            onEditAddress();
          }}
          onDelete={() => {
            setIsEditModalOpen(false);
            onDeleteAddress();
          }}
          addressId={data.id || 0}
          dictionary={dictionary}
        />
      )}
    </StyledContainer>
  );
};

export default AddedAddressCard;
