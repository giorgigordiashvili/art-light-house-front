import React from "react";
import styled from "styled-components";
import EditIcon from "./EditIcon";
import AddedAddressIcon from "./AddedAddressIcon";
import Image from "next/image";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  width: 367px;
  height: 100px;
  background-color: #2a2a2a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  border-radius: 10px;
  padding: 26px 23px 26px 26px;
`;

const StyledPlace = styled.p`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 13px;
  line-height: 159%;
  letter-spacing: 0px;
  vertical-align: middle;
  color: #ffffff;
`;

const StyledAddress = styled.p`
  color: #ffffff;
  font-family: Helvetica;
  font-weight: 400;
  font-size: 13px;
  line-height: 159%;
  letter-spacing: 0px;
  vertical-align: middle;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 170px;
`;

type AddressData = {
  place: string;
  address: string;
  additionalInfo?: string;
};

const iconMap: Record<string, string> = {
  სახლი: "/assets/home.svg",
  სამსახური: "/assets/briefcase.svg",
  სხვა: "/assets/pin.svg",
};

const AddedAddressCard = ({ data }: { data: AddressData }) => {
  return (
    <StyledContainer>
      <Image src={iconMap[data.place]} width={24} height={24} alt="icon" />
      <StyledTextWrapper>
        <StyledPlace>{data.place}</StyledPlace>
        <StyledAddress>{data.address}</StyledAddress>
      </StyledTextWrapper>
      <EditIcon />
    </StyledContainer>
  );
};

export default AddedAddressCard;
