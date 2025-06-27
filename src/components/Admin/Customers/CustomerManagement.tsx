"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CustomerTable from "./CustomerTable";
import CustomerFilters from "./CustomerFilters";
import CustomerStats from "./CustomerStats";

const Container = styled.div`
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const StatsSection = styled.div`
  margin-bottom: 24px;
`;

export interface Customer {
  id: string;
  clerk_id: string;
  email: string | null;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerFiltersState {
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState<CustomerFiltersState>({
    search: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await fetch(`/api/admin/customers?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data.customers);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: Partial<CustomerFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      // Refresh the customers list
      await fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert("Failed to delete customer. Please try again.");
    }
  };

  const handleBulkDelete = async (customerIds: string[]) => {
    if (
      !confirm(
        `Are you sure you want to delete ${customerIds.length} customers? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/customers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete customers");
      }

      // Refresh the customers list
      await fetchCustomers();
    } catch (err) {
      console.error("Error deleting customers:", err);
      alert("Failed to delete customers. Please try again.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, pagination.limit, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <PageHeader>
        <Title>Customer Management</Title>
      </PageHeader>

      <StatsSection>
        <CustomerStats totalCustomers={pagination.total} loading={loading} />
      </StatsSection>

      <CustomerFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onRefresh={fetchCustomers}
      />

      <CustomerTable
        customers={customers}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onDeleteCustomer={handleDeleteCustomer}
        onBulkDelete={handleBulkDelete}
        onRefresh={fetchCustomers}
      />
    </Container>
  );
};

export default CustomerManagement;
