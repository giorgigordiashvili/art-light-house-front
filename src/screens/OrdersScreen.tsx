"use client";
import styled from "styled-components";
import OrderMain from "@/MyOrders/OrderMain";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const OrdersScreen = () => {
  return (
    <StyledComponent>
      <OrderMain></OrderMain>
    </StyledComponent>
  );
};

export default OrdersScreen;
