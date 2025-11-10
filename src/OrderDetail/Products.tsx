import styled from "styled-components";
import type { OrderItem } from "@/api/generated/interfaces";

const ProductsCard = styled.div`
  display: flex;
  align-items: center;
  background: #2a2a2a96;
  padding: 20px;
  border-radius: 17px;
  color: white;
  width: 100%;
  max-width: 532px;
  /* min-width:340px; */
  height: 113px;
  position: relative;
  gap: 24px;
  @media (max-width: 1080px) {
    max-width: none;
  }
`;

const ImagePlaceholder = styled.div`
  width: 73px;
  height: 73px;
  background-color: #3a3a3a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #ccc;
  flex-shrink: 0;
  overflow: hidden;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
`;

const Title = styled.span`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 17px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Price = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
`;

const Quantity = styled.span`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 14px;
  color: #999;
`;

interface ProductProps {
  dictionary?: any;
  orderItem?: OrderItem;
}

const Product = ({ orderItem }: ProductProps) => {
  // If no orderItem provided, show placeholder
  if (!orderItem) {
    return (
      <ProductsCard>
        <ImagePlaceholder>Product image</ImagePlaceholder>
        <InfoWrapper>
          <Title>Product Title</Title>
          <PriceRow>
            <Price>0.00 ₾</Price>
            <Quantity>x 1</Quantity>
          </PriceRow>
        </InfoWrapper>
      </ProductsCard>
    );
  }
  return (
    <ProductsCard>
      <ImagePlaceholder>Product image</ImagePlaceholder>
      <InfoWrapper>
        <Title>{orderItem.product_name || "Product"}</Title>
        <PriceRow>
          <Price>{orderItem.subtotal} ₾</Price>
          <Quantity>x {orderItem.quantity}</Quantity>
        </PriceRow>
      </InfoWrapper>
    </ProductsCard>
  );
};

export default Product;
