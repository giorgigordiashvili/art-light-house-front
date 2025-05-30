"use client";

import AdminDashboardLayout from "@/components/Admin/Layout/AdminDashboardLayout";
import AdminHero from "@/components/Admin/Hero/AdminHero";
import styled from "styled-components";

const DashboardContent = styled.div``;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const DashboardCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: 200px;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2b3445;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ViewAllLink = styled.a`
  font-size: 0.875rem;
  color: #2b3445;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function AdminDashboardPage() {
  // In a real app, these would come from API calls
  const mockData = {
    productCount: 128,
    orderCount: 35,
    customerCount: 84,
  };

  return (
    <AdminDashboardLayout>
      <DashboardContent>
        <AdminHero
          username="Admin User"
          productCount={mockData.productCount}
          orderCount={mockData.orderCount}
          customerCount={mockData.customerCount}
        />

        <CardGrid>
          <DashboardCard>
            <CardTitle>
              Recent Orders
              <ViewAllLink href="/admin/orders">View All</ViewAllLink>
            </CardTitle>
            {/* Order list would go here */}
            <p>No recent orders to display.</p>
          </DashboardCard>

          <DashboardCard>
            <CardTitle>
              Top Products
              <ViewAllLink href="/admin/products">View All</ViewAllLink>
            </CardTitle>
            {/* Product list would go here */}
            <p>No top products to display.</p>
          </DashboardCard>

          <DashboardCard>
            <CardTitle>Quick Actions</CardTitle>
            {/* Quick action buttons would go here */}
            <p>No quick actions available.</p>
          </DashboardCard>
        </CardGrid>
      </DashboardContent>
    </AdminDashboardLayout>
  );
}
