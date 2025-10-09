import styled from "styled-components";
import Products from "@/OrderDetail/Products";
import SummaryBlock from "@/OrderDetail/SummaryBlock";
import Address from "@/OrderDetail/Address";
import Delivery from "./Delivery";
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
  z-index: 1;
  @media (max-width: 1080px) {
    width: calc(100% - 32px);
    padding: 16px 16px;
  }
`;

const Title = styled.p`
  color: white;
  font-size: 34px;
  font-weight: 400;
  margin-bottom: 47px;
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
  }
`;

interface ContainerProps {
  dictionary: any;
  order: Order;
}

const Container = ({ dictionary, order }: ContainerProps) => {
  return (
    <StyleContainer>
      <Title>
        {dictionary?.succsessOrder?.title || "Order"} #{order.order_number}
      </Title>

      <SectionTitle>{dictionary?.succsessOrder?.products}</SectionTitle>
      <ProductsWrapper>
        {order.items.map((item) => (
          <Products key={item.id} dictionary={dictionary} orderItem={item} />
        ))}
      </ProductsWrapper>
      <SectionTitle>{dictionary?.succsessOrder?.address}</SectionTitle>
      <Address dictionary={dictionary} address={order.delivery_address_data} />
      <SectionTitle>{dictionary?.succsessOrder?.delivery}</SectionTitle>

      <Delivery dictionary={dictionary} order={order} />
      <SummaryBlock dictionary={dictionary} order={order} />
    </StyleContainer>
  );
};

export default Container;
