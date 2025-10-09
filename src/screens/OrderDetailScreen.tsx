"use client";
import styled from "styled-components";
import Container from "@/OrderDetail/Container";
import BigCircle from "@/components/ui/BigCircle";
import LeftCircle from "@/components/ui/LeftCircle";
import NewCircle from "@/components/ui/NewCircle";
import { useEffect, useState } from "react";
import { ordersRetrieve } from "@/api/generated/api";
import type { Order } from "@/api/generated/interfaces";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface OrderDetailScreenProps {
  dictionary: any;
  orderId: string;
}

const OrderDetailScreen = ({ dictionary, orderId }: OrderDetailScreenProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await ordersRetrieve(orderId);
        setOrder(orderData);
      } catch (err) {
        setError("Failed to fetch order");
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <StyledComponent>
        <BigCircle variant={2} />
        <div style={{ color: "white", fontSize: "24px" }}>Loading...</div>
      </StyledComponent>
    );
  }

  if (error || !order) {
    return (
      <StyledComponent>
        <BigCircle variant={2} />
        <div style={{ color: "white", fontSize: "24px" }}>{error || "Order not found"}</div>
      </StyledComponent>
    );
  }

  return (
    <StyledComponent>
      <BigCircle variant={2} />
      <NewCircle size="small" right="142px" top="200px" media="yes" />
      <LeftCircle size="small" left="-140px" top="900px" media="yes" />
      <NewCircle size="small" right="142px" top="1000px" media="yes" />
      <Container dictionary={dictionary} order={order} />
    </StyledComponent>
  );
};

export default OrderDetailScreen;
