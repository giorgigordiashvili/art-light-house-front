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

const EmptyText = styled.p`
  color: #999;
  text-align: center;
  padding: 20px;
`;

const SkeletonOrderCard = styled.div`
  width: 100%;
  min-height: 120px;
  border-radius: 12px;
  border: 1px solid #ffffff12;
  background: rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;
  padding: 20px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
    z-index: 1;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @media (max-width: 1080px) {
    min-height: 100px;
    padding: 16px;
  }
`;

const SkeletonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SkeletonOrderNumber = styled.div`
  width: 30%;
  height: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const SkeletonStatus = styled.div`
  width: 20%;
  height: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const SkeletonInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonText = styled.div`
  width: 60%;
  height: 14px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;

  &:nth-child(2) {
    width: 40%;
  }
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
          <>
            {[1, 2, 3, 4].map((index) => (
              <SkeletonOrderCard key={index}>
                <SkeletonHeader>
                  <SkeletonOrderNumber />
                  <SkeletonStatus />
                </SkeletonHeader>
                <SkeletonInfo>
                  <SkeletonText />
                  <SkeletonText />
                </SkeletonInfo>
              </SkeletonOrderCard>
            ))}
          </>
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
