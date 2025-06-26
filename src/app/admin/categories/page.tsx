"use client";
import React from "react";
import styled from "styled-components";
import CategoryManagement from "@/components/Admin/Categories/CategoryManagement";

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const PageContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.header`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #2b3445;
  margin: 0;
`;

const PageDescription = styled.p`
  color: #7d879c;
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
`;

export default function CategoriesPage() {
  return (
    <PageContainer>
      <PageContent>
        <PageHeader>
          <PageTitle>Category Management</PageTitle>
          <PageDescription>
            Manage product categories, create hierarchical structures, and organize your product
            catalog.
          </PageDescription>
        </PageHeader>
        <CategoryManagement />
      </PageContent>
    </PageContainer>
  );
}
