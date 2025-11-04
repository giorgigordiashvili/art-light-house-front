"use client";
import styled from "styled-components";
import Products from "@/OrderDetail/Products";
import SummaryBlock from "@/OrderDetail/SummaryBlock";
import Address from "@/OrderDetail/Address";
import Delivery from "@/OrderDetail/Delivery";
import { useEffect, useState } from "react";
import { apiEcommerceClientOrdersList } from "@/api/generated/api";
import type { Order } from "@/api/generated/interfaces";

const StyleContainer = styled.div`
  width: calc(100% - 148px);
  max-width: 1294px;
  min-height: 1069px;
  padding: 78px 104px;
  background: #1a1a1a96;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  margin-top: 174px;
  margin-bottom: 209px;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);

  @media (max-width: 1080px) {
    width: calc(100% - 32px);
    padding: 16px;
    /* align-items: flex-start; */
    justify-content: center;
  }
`;

const Title = styled.p`
  color: white;
  font-size: 34px;
  font-weight: 400;
  margin-bottom: 17px;
  margin-top: 20px;
  display: flex;
  margin: 0 auto;

  @media (max-width: 1080px) {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: -5px;
    margin-top: 50px;
    /* margin: 0 auto; */
  }
`;

const SectionTitle = styled.p`
  color: white;
  font-family: Helvetica;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0%;
  margin-bottom: 20px;
  margin-top: 44px;
  @media (max-width: 1080px) {
  }
`;

const ProductsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  flex-wrap: nowrap;
  width: 100%;
  max-width: 1084px;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
    /* max-width: 532px; */
    grid-template-columns: 1fr;
  }
`;
const CheckIcon = styled.img`
  position: absolute;
  top: -87.5px;
  left: 50%;
  transform: translateX(-50%);
  width: 175px;
  height: 175px;
  z-index: 10;
  @media (max-width: 1080px) {
    top: -68.5px;
    width: 137px;
    height: 137px;
  }
`;

const Center = styled.div`
  @media (max-width: 1080px) {
    display: flex;
    /* margin: 0 auto; */
    justify-content: center;
    flex-direction: column;
  }
`;
const Container = ({ dictionary }: { dictionary: any }) => {
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        setLoading(true);
        const response = await apiEcommerceClientOrdersList();
        // Get the most recent order (first in the array, assuming sorted by date)
        if (response.results.length > 0) {
          setLatestOrder(response.results[0]);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, []);

  if (loading) {
    return (
      <StyleContainer>
        <CheckIcon src="/assets/icons/checkmob.svg" alt="Checkmark" />
        <Title>Loading...</Title>
      </StyleContainer>
    );
  }

  return (
    <StyleContainer>
      <CheckIcon src="/assets/icons/checkmob.svg" alt="Checkmark" />

      <Title>{dictionary?.succsessOrder?.title}</Title>

      <Center>
        <SectionTitle>{dictionary?.succsessOrder?.products}</SectionTitle>
        <ProductsWrapper>
          {latestOrder?.items.map((item) => (
            <Products key={item.id} dictionary={dictionary} orderItem={item} />
          ))}
        </ProductsWrapper>
        <SectionTitle>{dictionary?.succsessOrder?.address}</SectionTitle>
        <Address dictionary={dictionary} address={latestOrder?.delivery_address_data} />
        <SectionTitle>{dictionary?.succsessOrder?.delivery}</SectionTitle>
        <Delivery dictionary={dictionary} order={latestOrder || undefined} />
        <SummaryBlock dictionary={dictionary} order={latestOrder || undefined} />
      </Center>
    </StyleContainer>
  );
};

export default Container;
