import styled from "styled-components";
import Image from "next/image";

const DeliveryCard = styled.div`
  display: flex;
  align-items: center;
  background: #2a2a2a96;
  padding: 26px 20px;
  border-radius: 17px;
  color: white;
  width: 100%;
  max-width: 800px;
  height: 100px;
  position: relative;
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
  margin-left: 20px;
`;

const Method = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 13px;
  color: #ffffff;
  margin-bottom: 3px;
`;

const Desc = styled.span`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 13px;
  color: #ffffff;
`;
const ChangeButton = styled.button`
  background-color: transparent;
  color: white;
  width: 82px;
  height: 40px;
  border: 1px solid #ffffff17;
  border-radius: 90px;
  font-size: 13px;
  cursor: pointer;
`;

const PaymentMethod = () => {
  return (
    <DeliveryCard>
      <IconWrapper>
        <Image src={"/assets/icons/gadaxda.svg"} alt="icon" width={24} height={24} />
      </IconWrapper>
      <InfoWrapper>
        <Method>ბარათი</Method>
        <Desc>ტრანზაქციის შემდეგ თქვენი ბარათის მონაცემები შეინახება ბანკის დაცულ სერვერზე</Desc>
      </InfoWrapper>
      <ChangeButton>შეცვლა</ChangeButton>
    </DeliveryCard>
  );
};

export default PaymentMethod;
