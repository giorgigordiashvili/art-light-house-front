"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/NewAdmin/layout/AdminLayout";
import { Button } from "@/components/NewAdmin/ui/Button";
import OrderDetail from "@/components/NewAdmin/orders/OrderDetail";
import { Order } from "@/api/generated/interfaces";
import adminAxios from "@/api/admin-axios";
import styled from "styled-components";
import { Select } from "@/components/NewAdmin/ui/Form";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  .header-left {
    h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 600;
    }

    .breadcrumb {
      margin-top: 8px;
      font-size: 0.875rem;
      color: #6c757d;

      a {
        color: #007bff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.125rem;
  color: #6c757d;
`;

const ErrorContainer = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 24px;
  border-radius: 8px;
  text-align: center;

  h3 {
    margin: 0 0 8px 0;
  }

  p {
    margin: 0;
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  padding: 24px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;

  &:hover {
    color: #212529;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #212529;
  }
`;

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAxios.get(`/api/orders/admin/orders/${orderId}/`);
      setOrder(response.data as Order);
      setNewStatus(String(response.data.status || "").toLowerCase());
      setNewPaymentStatus(String(response.data.payment_status || "").toLowerCase());
    } catch (err: any) {
      console.error("Failed to load order:", err);
      setError(err.response?.data?.message || "Failed to load order. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId, loadOrder]);

  const handleUpdateStatus = () => {
    if (order) {
      setNewStatus(String(order.status || "").toLowerCase());
      setShowStatusModal(true);
    }
  };

  const handleUpdatePayment = () => {
    if (order) {
      setNewPaymentStatus(String(order.payment_status || "").toLowerCase());
      setShowPaymentModal(true);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      await adminAxios.patch(`/api/orders/admin/orders/${order.id}/status/`, {
        status: newStatus,
      });

      // Reload order after successful update
      await loadOrder();
      setShowStatusModal(false);
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentUpdate = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      await adminAxios.patch(`/api/orders/admin/orders/${order.id}/payment/`, {
        payment_status: newPaymentStatus,
      });

      // Reload order after successful update
      await loadOrder();
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Failed to update payment status:", error);
      alert("Failed to update payment status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingContainer>Loading order details...</LoadingContainer>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <ErrorContainer>
          <h3>Error Loading Order</h3>
          <p>{error || "Order not found"}</p>
          <Button
            $variant="secondary"
            onClick={() => router.push("/admin/orders")}
            style={{ marginTop: "16px" }}
          >
            Back to Orders
          </Button>
        </ErrorContainer>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader>
        <div className="header-left">
          <h1>Order {order.order_number}</h1>
          <div className="breadcrumb">
            <Link href="/admin">Dashboard</Link> / <Link href="/admin/orders">Orders</Link> /{" "}
            {order.order_number}
          </div>
        </div>
        <Button $variant="secondary" onClick={() => router.push("/admin/orders")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back to Orders
        </Button>
      </PageHeader>

      <OrderDetail
        order={order}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePayment={handleUpdatePayment}
      />

      {/* Status Update Modal */}
      <Modal $isOpen={showStatusModal}>
        <ModalContent>
          <ModalHeader>
            <h2>Update Order Status</h2>
            <CloseButton onClick={() => setShowStatusModal(false)}>×</CloseButton>
          </ModalHeader>

          <div>
            <p style={{ marginBottom: "16px", color: "#6c757d" }}>
              Order: <strong>{order.order_number}</strong>
            </p>

            <FormGroup>
              <label htmlFor="status">New Status</label>
              <Select id="status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </FormGroup>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <Button
                $variant="secondary"
                onClick={() => setShowStatusModal(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate} disabled={updating}>
                {updating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Payment Status Update Modal */}
      <Modal $isOpen={showPaymentModal}>
        <ModalContent>
          <ModalHeader>
            <h2>Update Payment Status</h2>
            <CloseButton onClick={() => setShowPaymentModal(false)}>×</CloseButton>
          </ModalHeader>

          <div>
            <p style={{ marginBottom: "16px", color: "#6c757d" }}>
              Order: <strong>{order.order_number}</strong>
            </p>

            <FormGroup>
              <label htmlFor="payment-status">New Payment Status</label>
              <Select
                id="payment-status"
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </Select>
            </FormGroup>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <Button
                $variant="secondary"
                onClick={() => setShowPaymentModal(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button onClick={handlePaymentUpdate} disabled={updating}>
                {updating ? "Updating..." : "Update Payment Status"}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
};

export default OrderDetailPage;
