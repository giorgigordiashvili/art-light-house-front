import styled from "styled-components";
import Image from "next/image";
import type { ClientAddress as AddressType } from "@/api/generated/interfaces";

const AddressCard = styled.div`
  display: flex;
  align-items: center;
  background: #2a2a2a96;
  padding: 22px;
  border-radius: 17px;
  color: white;
  width: 100%;
  max-width: 532px;
  /* min-width: 340px; */
  height: 93px;
  position: relative;
  gap: 20px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 30px;
  border: 1px solid #ffffff1a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
`;

const Title = styled.span`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 3px;
`;

const Add = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
`;

interface AddressProps {
  dictionary?: {
    succsessOrder?: {
      cardTitle1?: string;
      cardDescription1?: string;
    };
    address?: {
      cardTitle3?: string;
      cardDescription1?: string;
    };
  };
  address?: AddressType;
}

const Address = ({ dictionary, address }: AddressProps) => {
  // If no address provided, show placeholder
  if (!address) {
    return (
      <AddressCard>
        <IconWrapper>
          <Image src={"/assets/addressIcon.svg"} alt="icon" width={24} height={24} />
        </IconWrapper>
        <InfoWrapper>
          <Title>
            {dictionary?.succsessOrder?.cardTitle1 || dictionary?.address?.cardTitle3 || "Work"}
          </Title>
          <Add>
            {dictionary?.succsessOrder?.cardDescription1 ||
              dictionary?.address?.cardDescription1 ||
              "5 Petre Kavtaradze Street"}
          </Add>
        </InfoWrapper>
      </AddressCard>
    );
  }

  return (
    <AddressCard>
      <IconWrapper>
        <Image src={"/assets/addressIcon.svg"} alt="icon" width={24} height={24} />
      </IconWrapper>
      <InfoWrapper>
        <Title>{address.label || "Address"}</Title>
        <Add>{address.address || address.city}</Add>
      </InfoWrapper>
    </AddressCard>
  );
};

export default Address;
