import styled from "styled-components";
import type { Order } from "@/api/generated/interfaces";

const SummaryContainer = styled.div`
  max-width: 532px;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: white;
  font-family: Helvetica;
  margin-top: 44px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 20px;
`;

const TotalLabel = styled.span`
  font-weight: 300;
  font-variant-numeric: stacked-fractions;
`;

const TotalPrice = styled.span`
  font-weight: 500;
  font-variant-numeric: stacked-fractions;
  text-align: right;
`;

const Divider = styled.hr`
  max-width: 532px;
  width: 100%;
  border: 1px solid #242424;
  margin-bottom: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 12px;
`;

const DetailLabel = styled.span`
  font-weight: 300;
  font-variant-numeric: stacked-fractions;
  vertical-align: middle;
`;

const DetailPrice = styled.span`
  font-weight: 500;
  text-align: right;
  font-variant-numeric: stacked-fractions;
  vertical-align: middle;
`;

interface SummaryBlockProps {
  dictionary?: any;
  order?: Order;
}

const SummaryBlock = ({ dictionary, order }: SummaryBlockProps) => {
  // If no order provided, show placeholder
  if (!order) {
    return (
      <SummaryContainer>
        <TotalRow>
          <TotalLabel>{dictionary?.succsessOrder?.summary || "Total"}</TotalLabel>
          <TotalPrice>{dictionary?.succsessOrder?.totalAmount || "499.99 ₾"}</TotalPrice>
        </TotalRow>

        <Divider />

        <DetailRow>
          <DetailLabel>{dictionary?.succsessOrder?.productCost || "Product price"}</DetailLabel>
          <DetailPrice>{dictionary?.succsessOrder?.productPrice || "499.99 ₾"}</DetailPrice>
        </DetailRow>
        <DetailRow>
          <DetailLabel>{dictionary?.succsessOrder?.deliveryCost || "Delivery service"}</DetailLabel>
          <DetailPrice>{dictionary?.succsessOrder?.deliveryAmount || "14.99 ₾"}</DetailPrice>
        </DetailRow>
        <DetailRow>
          <DetailLabel>{dictionary?.succsessOrder?.serviceFee || "Service commission"}</DetailLabel>
          <DetailPrice>{dictionary?.succsessOrder?.serviceFeeAmount || "2.99 ₾"}</DetailPrice>
        </DetailRow>
      </SummaryContainer>
    );
  }

  return (
    <SummaryContainer>
      <TotalRow>
        <TotalLabel>{dictionary?.succsessOrder?.summary || "Total"}</TotalLabel>
        <TotalPrice>{order.total_amount} ₾</TotalPrice>
      </TotalRow>

      <Divider />

      <DetailRow>
        <DetailLabel>{dictionary?.succsessOrder?.productCost || "Subtotal"}</DetailLabel>
        <DetailPrice>{order.subtotal} ₾</DetailPrice>
      </DetailRow>
      <DetailRow>
        <DetailLabel>{dictionary?.succsessOrder?.deliveryCost || "Delivery"}</DetailLabel>
        <DetailPrice>{order.delivery_fee || "0.00"} ₾</DetailPrice>
      </DetailRow>
      {order.tax_amount && parseFloat(order.tax_amount) > 0 && (
        <DetailRow>
          <DetailLabel>{dictionary?.succsessOrder?.tax || "Tax"}</DetailLabel>
          <DetailPrice>{order.tax_amount} ₾</DetailPrice>
        </DetailRow>
      )}
      {order.discount_amount && parseFloat(order.discount_amount) > 0 && (
        <DetailRow>
          <DetailLabel>{dictionary?.succsessOrder?.discount || "Discount"}</DetailLabel>
          <DetailPrice>-{order.discount_amount} ₾</DetailPrice>
        </DetailRow>
      )}
    </SummaryContainer>
  );
};

export default SummaryBlock;
