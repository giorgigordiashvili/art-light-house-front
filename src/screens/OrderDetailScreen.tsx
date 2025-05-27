"use client";
import styled from "styled-components";
import Container from "@/OrderDetail/Container";
import BigCircle from "@/components/ui/BigCircle";
import LeftCircle from "@/components/ui/LeftCircle";
import NewCircle from "@/components/ui/NewCircle";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const OrderDetailScreen = ({ dictionary }: any) => {
  return (
    <StyledComponent>
      <BigCircle variant={2} />
      <NewCircle size="small" right="142px" top="200px" media="yes" />
      <LeftCircle size="small" left="-140px" top="900px" media="yes" />
      <NewCircle size="small" right="142px" top="1000px" media="yes" />
      <Container dictionary={dictionary}></Container>
    </StyledComponent>
  );
};

export default OrderDetailScreen;
