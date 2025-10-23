"use client";
import { Order } from "@/api/generated/interfaces";
import styled from "styled-components";
import { Button } from "@/components/NewAdmin/ui/Button";

const DetailContainer = styled.div`
  display: grid;
  gap: 24px;
`;

const Section = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #212529;
  padding-bottom: 12px;
  border-bottom: 2px solid #e9ecef;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6c757d;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 1rem;
    color: #212529;
    font-weight: 500;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
  background: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case "pending":
        return "#fff3cd";
      case "confirmed":
        return "#d1ecf1";
      case "shipped":
        return "#d4edda";
      case "delivered":
        return "#c3e6cb";
      case "cancelled":
        return "#f8d7da";
      default:
        return "#e2e3e5";
    }
  }};
  color: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case "pending":
        return "#856404";
      case "confirmed":
        return "#0c5460";
      case "shipped":
        return "#155724";
      case "delivered":
        return "#155724";
      case "cancelled":
        return "#721c24";
      default:
        return "#383d41";
    }
  }};
`;

const PaymentStatusBadge = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
  background: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case "paid":
        return "#d4edda";
      case "pending":
        return "#fff3cd";
      case "failed":
        return "#f8d7da";
      case "refunded":
        return "#d1ecf1";
      default:
        return "#e2e3e5";
    }
  }};
  color: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case "paid":
        return "#155724";
      case "pending":
        return "#856404";
      case "failed":
        return "#721c24";
      case "refunded":
        return "#0c5460";
      default:
        return "#383d41";
    }
  }};
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  thead {
    background: #f8f9fa;
  }

  th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 12px;
    color: #212529;
    border-bottom: 1px solid #dee2e6;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .details {
    .title {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .sku {
      font-size: 0.875rem;
      color: #6c757d;
    }
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.9375rem;

  &.total {
    font-size: 1.125rem;
    font-weight: 700;
    padding-top: 16px;
    margin-top: 12px;
    border-top: 2px solid #dee2e6;
  }

  .label {
    color: #6c757d;
  }

  .value {
    font-weight: 600;
    color: #212529;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

interface OrderDetailProps {
  order: Order;
  onUpdateStatus?: () => void;
  onUpdatePayment?: () => void;
}

const OrderDetail = ({ order, onUpdateStatus, onUpdatePayment }: OrderDetailProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DetailContainer>
      {/* Order Information */}
      <Section>
        <SectionTitle>Order Information</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <label>Order Number</label>
            <div className="value">{order.order_number}</div>
          </InfoItem>
          <InfoItem>
            <label>Order Status</label>
            <div className="value">
              <StatusBadge $status={order.status_display}>{order.status_display}</StatusBadge>
            </div>
          </InfoItem>
          <InfoItem>
            <label>Payment Status</label>
            <div className="value">
              <PaymentStatusBadge $status={order.payment_status_display}>
                {order.payment_status_display}
              </PaymentStatusBadge>
            </div>
          </InfoItem>
          <InfoItem>
            <label>Created At</label>
            <div className="value">{formatDate(order.created_at)}</div>
          </InfoItem>
          <InfoItem>
            <label>Updated At</label>
            <div className="value">{formatDate(order.updated_at)}</div>
          </InfoItem>
          {order.confirmed_at && (
            <InfoItem>
              <label>Confirmed At</label>
              <div className="value">{formatDate(order.confirmed_at)}</div>
            </InfoItem>
          )}
          {order.shipped_at && (
            <InfoItem>
              <label>Shipped At</label>
              <div className="value">{formatDate(order.shipped_at)}</div>
            </InfoItem>
          )}
          {order.delivered_at && (
            <InfoItem>
              <label>Delivered At</label>
              <div className="value">{formatDate(order.delivered_at)}</div>
            </InfoItem>
          )}
        </InfoGrid>

        {onUpdateStatus && onUpdatePayment && (
          <ActionButtons>
            <Button onClick={onUpdateStatus}>Update Order Status</Button>
            <Button $variant="secondary" onClick={onUpdatePayment}>
              Update Payment Status
            </Button>
          </ActionButtons>
        )}
      </Section>

      {/* Customer & Delivery Information */}
      <Section>
        <SectionTitle>Customer & Delivery Information</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <label>Phone Number</label>
            <div className="value">{order.phone_number}</div>
          </InfoItem>
          <InfoItem>
            <label>Delivery Method</label>
            <div className="value">{order.delivery_method_display}</div>
          </InfoItem>
          {order.delivery_fee && (
            <InfoItem>
              <label>Delivery Fee</label>
              <div className="value">₾{order.delivery_fee}</div>
            </InfoItem>
          )}
        </InfoGrid>

        <InfoItem style={{ marginTop: "16px" }}>
          <label>Delivery Address</label>
          <div className="value">
            {order.delivery_address_data ? (
              <>
                <div>{order.delivery_address_data.address_string}</div>
                {order.delivery_address_data.extra_details && (
                  <div style={{ fontSize: "0.875rem", color: "#6c757d", marginTop: "4px" }}>
                    {order.delivery_address_data.extra_details}
                  </div>
                )}
              </>
            ) : (
              "N/A"
            )}
          </div>
        </InfoItem>

        {order.delivery_notes && (
          <InfoItem style={{ marginTop: "16px" }}>
            <label>Delivery Notes</label>
            <div className="value">{order.delivery_notes}</div>
          </InfoItem>
        )}
      </Section>

      {/* Order Items */}
      <Section>
        <SectionTitle>Order Items ({order.total_items} items)</SectionTitle>
        <ItemsTable>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <ProductInfo>
                    <ProductImage
                      src={item.product_image_url || "/assets/placeholder.png"}
                      alt={item.product_title}
                    />
                    <div className="details">
                      <div className="title">{item.product_title}</div>
                      <div className="sku">SKU: {item.product_sku}</div>
                    </div>
                  </ProductInfo>
                </td>
                <td>{item.quantity}</td>
                <td>₾{item.unit_price}</td>
                <td>₾{item.total_price}</td>
              </tr>
            ))}
          </tbody>
        </ItemsTable>
      </Section>

      {/* Order Summary */}
      <Section>
        <SectionTitle>Order Summary</SectionTitle>
        <div>
          <TotalRow>
            <span className="label">Subtotal:</span>
            <span className="value">₾{order.subtotal}</span>
          </TotalRow>
          {order.delivery_fee && (
            <TotalRow>
              <span className="label">Delivery Fee:</span>
              <span className="value">₾{order.delivery_fee}</span>
            </TotalRow>
          )}
          {order.tax_amount && parseFloat(order.tax_amount) > 0 && (
            <TotalRow>
              <span className="label">Tax:</span>
              <span className="value">₾{order.tax_amount}</span>
            </TotalRow>
          )}
          {order.discount_amount && parseFloat(order.discount_amount) > 0 && (
            <TotalRow>
              <span className="label">Discount:</span>
              <span className="value">-₾{order.discount_amount}</span>
            </TotalRow>
          )}
          <TotalRow className="total">
            <span className="label">Total:</span>
            <span className="value">₾{order.total_amount}</span>
          </TotalRow>
        </div>

        {order.payment_method && (
          <InfoItem style={{ marginTop: "16px" }}>
            <label>Payment Method</label>
            <div className="value">{order.payment_method}</div>
          </InfoItem>
        )}
        {order.payment_transaction_id && (
          <InfoItem style={{ marginTop: "12px" }}>
            <label>Transaction ID</label>
            <div className="value">{order.payment_transaction_id}</div>
          </InfoItem>
        )}
      </Section>
    </DetailContainer>
  );
};

export default OrderDetail;
