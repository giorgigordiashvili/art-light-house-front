import styled from "styled-components";
import type { Order } from "@/api/generated/interfaces";

const SummaryContainer = styled.div`
  /* max-width: 532px; */
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
  /* max-width: 532px; */
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

// Returns the numeric value when it is a finite, non-zero number; otherwise null
const nonZeroAmount = (value?: string | number | null): number | null => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) && num !== 0 ? num : null;
};

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

      {order.subtotal !== undefined && order.subtotal !== null && order.subtotal !== "" && (
        <DetailRow>
          <DetailLabel>{dictionary?.succsessOrder?.productCost || "Product price"}</DetailLabel>
          <DetailPrice>{order.subtotal} ₾</DetailPrice>
        </DetailRow>
      )}
      {nonZeroAmount(order.shipping_cost) !== null && (
        <DetailRow>
          <DetailLabel>{dictionary?.succsessOrder?.deliveryCost || "Delivery service"}</DetailLabel>
          <DetailPrice>{order.shipping_cost} ₾</DetailPrice>
        </DetailRow>
      )}
      {nonZeroAmount(order.tax_amount) !== null && (
        <DetailRow>
          <DetailLabel>{dictionary?.succsessOrder?.tax || "Tax"}</DetailLabel>
          <DetailPrice>{order.tax_amount} ₾</DetailPrice>
        </DetailRow>
      )}
      {nonZeroAmount(order.discount_amount) !== null && (
        <DetailRow>
          <DetailLabel>{dictionary?.succsessOrder?.discount || "Discount"}</DetailLabel>
          <DetailPrice>-{String(order.discount_amount).replace(/^-/, "")} ₾</DetailPrice>
        </DetailRow>
      )}
      <DetailRow>
        <DetailLabel>{dictionary?.succsessOrder?.orderNumber || "Order Number"}</DetailLabel>
        <DetailPrice>{order.order_number}</DetailPrice>
      </DetailRow>
      <DetailRow>
        <DetailLabel>{dictionary?.succsessOrder?.itemCount || "Items"}</DetailLabel>
        <DetailPrice>{order.total_items}</DetailPrice>
      </DetailRow>
      <DetailRow>
        <DetailLabel>{dictionary?.succsessOrder?.status || "Status"}</DetailLabel>
        <DetailPrice>
          {dictionary?.succsessOrder?.statuses?.[String(order.status ?? "pending")] ??
            String(order.status ?? "pending")}
        </DetailPrice>
      </DetailRow>
    </SummaryContainer>
  );
};

export default SummaryBlock;
