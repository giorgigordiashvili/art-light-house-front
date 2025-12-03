"use client";
import styled from "styled-components";
import OrderMain from "@/MyOrders/OrderMain";
import Circle from "@/components/ui/Circle";
import NewCircle from "@/components/ui/NewCircle";
import LeftCircle from "@/components/ui/LeftCircle";
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: #0b0b0b;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  align-items: center;
`;

const StyledCircle = styled.div`
  position: absolute;
  left: 43%;
  top: 170px;
  transform: translateX(-50%);
  @media (max-width: 1080px) {
    top: 240px;
  }
  @media (max-width: 505px) {
    left: 30%;
  }
  @media (max-width: 409px) {
    left: 20%;
  }
  @media (max-width: 355px) {
    left: 10%;
  }
`;

const OrdersScreen = ({ dictionary }: any) => {
  return (
    <StyledComponent>
      <BigCircle variant={2} />
      <StyledCircle>
        <Circle size="small" />
      </StyledCircle>
      <LeftCircle size="small" left="-140px" top="900px" media="yes" />
      <NewCircle size="small" right="142px" top="1000px" media="yes" />
      <OrderMain dictionary={dictionary.orders} />
    </StyledComponent>
  );
};

export default OrdersScreen;
