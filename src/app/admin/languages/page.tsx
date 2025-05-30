"use client";

import AdminDashboardLayout from "@/components/Admin/Layout/AdminDashboardLayout";
import StyledTranslationAdmin from "@/components/StyledTranslationAdmin";
import styled from "styled-components";

const LanguagesContent = styled.div`
  background-color: #fafafa;
`;

const PageHeader = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #2b3445;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: #7d879c;
  margin: 0;
  font-size: 1rem;
`;

export default function AdminLanguagesPage() {
  return (
    <AdminDashboardLayout>
      <LanguagesContent>
        <PageHeader>
          <PageTitle>Language Management</PageTitle>
          <PageDescription>
            Manage languages and translations for your application. Add new languages, edit
            translations, and control which languages are active on your site.
          </PageDescription>
        </PageHeader>
        <StyledTranslationAdmin />
      </LanguagesContent>
    </AdminDashboardLayout>
  );
}
