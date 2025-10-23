import styled from "styled-components";
import OrderCard from "@/MyOrders/OrderCard";
import { useEffect, useState } from "react";
import { ordersList } from "@/api/generated/api";
import type { Order as OrderType } from "@/api/generated/interfaces";

const StylePass = styled.div`
  width: 100%;
  max-width: 100%;

  max-height: 544px;
  padding: 24px;
  background: #1a1a1a96;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);

  @media (max-width: 1080px) {
    width: 100%;
    padding: 16px;
    max-height: auto;
  }
`;

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1080px) {
  }
`;

const Title = styled.p`
  position: relative;
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 24px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: -24px;
    right: -24px;
    height: 1px;
    background-color: #242424;
  }

  /* @media (max-width: 1080px) {
    font-size: 16px;
    padding-bottom: 12px;

    &::after {
      left: -16px;
      right: -16px;
    }
  } */
`;

const LoadingText = styled.p`
  color: white;
  text-align: center;
  padding: 20px;
`;

const EmptyText = styled.p`
  color: #999;
  text-align: center;
  padding: 20px;
`;

const Order = ({ dictionary }: any) => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await ordersList();
        setOrders(ordersData);
      } catch {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <StylePass>
      <Title>{dictionary?.orderBarTitle || "Orders"}</Title>
      <InputsWrapper>
        {loading ? (
          <LoadingText>Loading orders...</LoadingText>
        ) : error ? (
          <EmptyText>{error}</EmptyText>
        ) : orders.length === 0 ? (
          <EmptyText>No orders found</EmptyText>
        ) : (
          orders.map((order) => <OrderCard key={order.id} dictionary={dictionary} order={order} />)
        )}
      </InputsWrapper>
    </StylePass>
  );
};

export default Order;
