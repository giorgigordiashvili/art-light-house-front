"use client";
import styled from "styled-components";
import AdminSidebar from "../Sidebar/AdminSidebar";

const DashboardContainer = styled.div`
  display: flex;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background-color: #fafafa;
  min-height: 100vh;
`;

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  return (
    <DashboardContainer>
      <AdminSidebar />
      <MainContent>{children}</MainContent>
    </DashboardContainer>
  );
};

export default AdminDashboardLayout;
