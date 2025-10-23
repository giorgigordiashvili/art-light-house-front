"use client";
import AdminLayout from "@/components/NewAdmin/layout/AdminLayout";
import { Card, CardHeader, CardContent } from "@/components/NewAdmin/ui/Card";
import styled from "styled-components";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled(Card)`
  padding: 24px;
  text-align: center;

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #007bff;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-change {
    font-size: 0.75rem;
    margin-top: 8px;

    &.positive {
      color: #28a745;
    }

    &.negative {
      color: #dc3545;
    }
  }
`;

const ActivitySection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  .activity-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;

    svg {
      width: 16px;
      height: 16px;
      color: #6c757d;
    }
  }

  .activity-content {
    flex: 1;

    .activity-title {
      font-weight: 500;
      margin: 0 0 4px 0;
      color: #212529;
    }

    .activity-time {
      font-size: 0.875rem;
      color: #6c757d;
      margin: 0;
    }
  }
`;

const QuickActions = styled.div`
  display: grid;
  gap: 12px;
`;

const QuickActionButton = styled.button`
  padding: 16px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
  }

  .action-title {
    font-weight: 500;
    margin: 0 0 4px 0;
    color: #212529;
  }

  .action-description {
    font-size: 0.875rem;
    color: #6c757d;
    margin: 0;
  }
`;

const AdminDashboard = () => {
  return (
    <AdminLayout
      title="Dashboard"
      description="Welcome to the admin dashboard. Monitor your store performance and manage content."
    >
      <StatsGrid>
        <StatCard>
          <div className="stat-value">156</div>
          <div className="stat-label">Total Products</div>
          <div className="stat-change positive">+12 this month</div>
        </StatCard>

        <StatCard>
          <div className="stat-value">8</div>
          <div className="stat-label">Categories</div>
          <div className="stat-change positive">+2 this month</div>
        </StatCard>

        <StatCard>
          <div className="stat-value">24</div>
          <div className="stat-label">Attributes</div>
          <div className="stat-change">No changes</div>
        </StatCard>

        <StatCard>
          <div className="stat-value">-</div>
          <div className="stat-label">Total Orders</div>
          <div className="stat-change">View all orders</div>
        </StatCard>
      </StatsGrid>

      <ActivitySection>
        <Card>
          <CardHeader>
            <h2>Recent Activity</h2>
          </CardHeader>
          <CardContent>
            <ActivityItem>
              <div className="activity-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="activity-content">
                <p className="activity-title">New product added: &quot;Abstract Canvas Art&quot;</p>
                <p className="activity-time">2 hours ago</p>
              </div>
            </ActivityItem>

            <ActivityItem>
              <div className="activity-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="activity-content">
                <p className="activity-title">Category &quot;Modern Art&quot; updated</p>
                <p className="activity-time">5 hours ago</p>
              </div>
            </ActivityItem>

            <ActivityItem>
              <div className="activity-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.5-1.1 1.9c-.1.3-.1.6-.1.9 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25L7.7 13H19l1.8-3.5L20.8 2H5.21L4.27 0H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
              <div className="activity-content">
                <p className="activity-title">Product &quot;Vintage Painting&quot; stock updated</p>
                <p className="activity-time">1 day ago</p>
              </div>
            </ActivityItem>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2>Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <QuickActions>
              <QuickActionButton onClick={() => (window.location.href = "/admin/orders")}>
                <p className="action-title">View Orders</p>
                <p className="action-description">Manage customer orders and shipments</p>
              </QuickActionButton>

              <QuickActionButton onClick={() => (window.location.href = "/admin/products")}>
                <p className="action-title">Add New Product</p>
                <p className="action-description">Create a new product listing</p>
              </QuickActionButton>

              <QuickActionButton onClick={() => (window.location.href = "/admin/categories")}>
                <p className="action-title">Manage Categories</p>
                <p className="action-description">Organize your product categories</p>
              </QuickActionButton>

              <QuickActionButton onClick={() => (window.location.href = "/admin/attributes")}>
                <p className="action-title">Edit Attributes</p>
                <p className="action-description">Configure product attributes</p>
              </QuickActionButton>
            </QuickActions>
          </CardContent>
        </Card>
      </ActivitySection>
    </AdminLayout>
  );
};

export default AdminDashboard;
