"use client";
import { ReactNode } from "react";
import styled from "styled-components";
import AdminSidebar from "./AdminSidebar";
import AdminAuthGuard from "../auth/AdminAuthGuard";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 32px;
  min-height: 100vh;
`;

const ContentHeader = styled.div`
  margin-bottom: 32px;

  h1 {
    margin: 0 0 8px 0;
    font-size: 2rem;
    font-weight: 600;
    color: #212529;
  }

  p {
    margin: 0;
    color: #6c757d;
    font-size: 1rem;
  }
`;

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  return (
    <AdminAuthProvider>
      <AdminAuthGuard>
        <LayoutContainer>
          <AdminSidebar />
          <MainContent>
            {(title || description) && (
              <ContentHeader>
                {title && <h1>{title}</h1>}
                {description && <p>{description}</p>}
              </ContentHeader>
            )}
            {children}
          </MainContent>
        </LayoutContainer>
      </AdminAuthGuard>
    </AdminAuthProvider>
  );
};

export default AdminLayout;
