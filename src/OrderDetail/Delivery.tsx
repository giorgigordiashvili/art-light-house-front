import styled from "styled-components";
import Image from "next/image";
import type { Order } from "@/api/generated/interfaces";

const DeliveryCard = styled.div`
  display: flex;
  align-items: center;
  background: #2a2a2a96;
  padding: 24px;
  border-radius: 17px;
  color: white;
  width: 100%;
  max-width: 349px;
  height: 96px;
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
  margin-left: 13px;
`;

const Title = styled.span`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 3px;
`;

const Time = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
`;

interface DeliveryProps {
  dictionary?: any;
  order?: Order;
}

const Delivery = ({ dictionary, order }: DeliveryProps) => {
  // If no order provided, show placeholder
  if (!order) {
    return (
      <DeliveryCard>
        <IconWrapper>
          <Image src={"/assets/Delivery Icon.svg"} alt="icon" width={24} height={24} />
        </IconWrapper>
        <InfoWrapper>
          <Title>{dictionary?.succsessOrder?.expressTitle || "Express delivery"}</Title>
          <Time>{dictionary?.succsessOrder?.expressTime || "40 minutes to 2 hours"}</Time>
        </InfoWrapper>
      </DeliveryCard>
    );
  }

  return (
    <DeliveryCard>
      <IconWrapper>
        <Image src={"/assets/Delivery Icon.svg"} alt="icon" width={24} height={24} />
      </IconWrapper>
      <InfoWrapper>
        <Title>{order.delivery_method_display}</Title>
        <Time>{order.delivery_notes || "No delivery notes"}</Time>
      </InfoWrapper>
    </DeliveryCard>
  );
};

export default Delivery;
