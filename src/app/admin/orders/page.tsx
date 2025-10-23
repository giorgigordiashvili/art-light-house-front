"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/NewAdmin/layout/AdminLayout";
import { Card, CardContent } from "@/components/NewAdmin/ui/Card";
import { Button } from "@/components/NewAdmin/ui/Button";
import { Input, Select } from "@/components/NewAdmin/ui/Form";
import OrdersTable from "@/components/NewAdmin/orders/OrdersTable";
import { Order } from "@/api/generated/interfaces";
import adminAxios from "@/api/admin-axios";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }

  p {
    margin: 8px 0 0 0;
    color: #6c757d;
    font-size: 0.875rem;
  }
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px 200px;
  gap: 16px;
  align-items: end;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #007bff;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
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

const OrdersManagement = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Fetch orders and statistics on component mount
  useEffect(() => {
    loadOrders();
    loadStatistics();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get(`/api/orders/admin/orders/`);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await adminAxios.get(`/api/orders/admin/statistics/`);
      setStatistics(response.data);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    }
  };

  const handleViewDetails = (order: Order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status_display.toLowerCase());
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      await adminAxios.patch(`/api/orders/admin/orders/${selectedOrder.id}/status/`, {
        status: newStatus,
      });

      // Reload orders after successful update
      await loadOrders();
      await loadStatistics();
      setShowStatusModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.delivery_address_data?.address_string?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status_display.toLowerCase() === statusFilter.toLowerCase();

    const matchesPaymentStatus =
      paymentStatusFilter === "all" ||
      order.payment_status_display.toLowerCase() === paymentStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const stats = statistics || {
    total_orders: orders.length,
    pending_orders: orders.filter((o) => o.status_display.toLowerCase() === "pending").length,
    completed_orders: orders.filter((o) => o.status_display.toLowerCase() === "delivered").length,
    total_revenue: orders
      .filter((o) => o.payment_status_display.toLowerCase() === "paid")
      .reduce((sum, o) => sum + parseFloat(o.total_amount), 0)
      .toFixed(2),
  };

  return (
    <AdminLayout>
      <PageHeader>
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders, track shipments, and update order statuses</p>
        </div>
      </PageHeader>

      <StatsRow>
        <StatCard>
          <div className="stat-value">{stats.total_orders || 0}</div>
          <div className="stat-label">Total Orders</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.pending_orders || 0}</div>
          <div className="stat-label">Pending Orders</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.completed_orders || 0}</div>
          <div className="stat-label">Completed Orders</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">₾{stats.total_revenue || "0.00"}</div>
          <div className="stat-label">Total Revenue</div>
        </StatCard>
      </StatsRow>

      <Card>
        <CardContent>
          <FilterSection>
            <div>
              <Input
                type="search"
                placeholder="Search orders by number, phone, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
            <div>
              <Select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </Select>
            </div>
          </FilterSection>

          <OrdersTable
            orders={filteredOrders}
            loading={loading}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
          />
        </CardContent>
      </Card>

      <Modal $isOpen={showStatusModal}>
        <ModalContent>
          <ModalHeader>
            <h2>Update Order Status</h2>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
          </ModalHeader>

          {selectedOrder && (
            <div>
              <p style={{ marginBottom: "16px", color: "#6c757d" }}>
                Order: <strong>{selectedOrder.order_number}</strong>
              </p>

              <FormGroup>
                <label htmlFor="status">New Status</label>
                <Select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </FormGroup>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <Button $variant="secondary" onClick={handleCloseModal} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleStatusUpdate} disabled={loading}>
                  {loading ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
};

export default OrdersManagement;
