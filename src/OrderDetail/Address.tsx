import styled from "styled-components";
import Image from "next/image";

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

const Address = () => {
  return (
    <AddressCard>
      <IconWrapper>
        <Image src={"/assets/addressIcon.svg"} alt="icon" width={24} height={24} />
      </IconWrapper>
      <InfoWrapper>
        <Title>სამსახური</Title>
        <Add>5 Petre Kavtaradze Street</Add>
      </InfoWrapper>
    </AddressCard>
  );
};

export default Address;
