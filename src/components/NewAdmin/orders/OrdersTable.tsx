"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableActions,
  EmptyState,
  LoadingSpinner,
} from "@/components/NewAdmin/ui/Table";
import { Button } from "@/components/NewAdmin/ui/Button";
import { Order } from "@/api/generated/interfaces";
import styled from "styled-components";
import Link from "next/link";

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
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
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
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

const PriceText = styled.div`
  font-weight: 600;
  color: #212529;
`;

const OrderNumber = styled.div`
  font-weight: 600;
  color: #007bff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const CustomerInfo = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

interface OrdersTableProps {
  orders: Order[];
  loading?: boolean;
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
}

const OrdersTable = ({
  orders,
  loading = false,
  onViewDetails,
  onUpdateStatus,
}: OrdersTableProps) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
        </svg>
        <h3>No orders found</h3>
        <p>Orders will appear here once customers start placing them.</p>
      </EmptyState>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Order Status</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link href={`/admin/orders/${order.id}`} style={{ textDecoration: "none" }}>
                <OrderNumber>{order.order_number}</OrderNumber>
              </Link>
            </TableCell>
            <TableCell>
              <CustomerInfo>
                <div>{order.phone_number}</div>
                <div>{order.delivery_address_data?.address_string?.substring(0, 30)}...</div>
              </CustomerInfo>
            </TableCell>
            <TableCell>
              {new Date(order.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell>{order.total_items} item(s)</TableCell>
            <TableCell>
              <PriceText>₾{order.total_amount}</PriceText>
            </TableCell>
            <TableCell>
              <StatusBadge $status={order.status_display}>{order.status_display}</StatusBadge>
            </TableCell>
            <TableCell>
              <PaymentStatusBadge $status={order.payment_status_display}>
                {order.payment_status_display}
              </PaymentStatusBadge>
            </TableCell>
            <TableCell>
              <TableActions>
                <Button $variant="secondary" $size="sm" onClick={() => onViewDetails(order)}>
                  View
                </Button>
                <Button $variant="primary" $size="sm" onClick={() => onUpdateStatus(order)}>
                  Update Status
                </Button>
              </TableActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
