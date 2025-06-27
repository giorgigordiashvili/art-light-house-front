"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Customer } from "./CustomerManagement";

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
`;

const TableHeaderCell = styled.th<{ sortable?: boolean }>`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
  cursor: ${(props) => (props.sortable ? "pointer" : "default")};

  &:hover {
    background: ${(props) => (props.sortable ? "#e9ecef" : "transparent")};
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ selected?: boolean }>`
  background: ${(props) => (props.selected ? "#f8f9fa" : "white")};
  border-bottom: 1px solid #e9ecef;

  &:hover {
    background: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 16px;
  color: #495057;
`;

const CheckboxCell = styled(TableCell)`
  width: 50px;
`;

const ActionsCell = styled(TableCell)`
  width: 120px;
`;

const Checkbox = styled.input`
  margin: 0;
`;

const ActionButton = styled.button<{ variant?: "edit" | "delete" }>`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === "edit" &&
    `
    background: #007bff;
    color: white;
    &:hover { background: #0056b3; }
  `}

  ${(props) =>
    props.variant === "delete" &&
    `
    background: #dc3545;
    color: white;
    &:hover { background: #c82333; }
  `}
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
`;

const PaginationInfo = styled.div`
  color: #6c757d;
  font-size: 14px;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover:not(:disabled) {
    background: #e9ecef;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  color: #495057;
  font-size: 14px;
`;

const BulkActionsBar = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? "flex" : "none")};
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #e3f2fd;
  border-bottom: 1px solid #bbdefb;
`;

const SelectedCount = styled.span`
  color: #1976d2;
  font-weight: 500;
`;

const BulkActionButton = styled.button<{ variant?: "delete" }>`
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  ${(props) =>
    props.variant === "delete" &&
    `
    background: #dc3545;
    color: white;
    &:hover { background: #c82333; }
  `}
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6c757d;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 16px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6c757d;
`;

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDeleteCustomer: (customerId: string) => void;
  onBulkDelete: (customerIds: string[]) => void;
  onRefresh: () => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading,
  error,
  pagination,
  onPageChange,
  onLimitChange,
  onDeleteCustomer,
  onBulkDelete,
  onRefresh,
}) => {
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(new Set(customers.map((c) => c.id)));
    } else {
      setSelectedCustomers(new Set());
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    const newSelected = new Set(selectedCustomers);
    if (checked) {
      newSelected.add(customerId);
    } else {
      newSelected.delete(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const handleBulkDelete = () => {
    onBulkDelete(Array.from(selectedCustomers));
    setSelectedCustomers(new Set());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <TableContainer>
        <LoadingMessage>Loading customers...</LoadingMessage>
      </TableContainer>
    );
  }

  if (error) {
    return (
      <TableContainer>
        <ErrorMessage>
          {error}
          <br />
          <button onClick={onRefresh} style={{ marginTop: "8px" }}>
            Try Again
          </button>
        </ErrorMessage>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <BulkActionsBar visible={selectedCustomers.size > 0}>
        <SelectedCount>
          {selectedCustomers.size} customer{selectedCustomers.size !== 1 ? "s" : ""} selected
        </SelectedCount>
        <BulkActionButton variant="delete" onClick={handleBulkDelete}>
          Delete Selected
        </BulkActionButton>
      </BulkActionsBar>

      <Table>
        <TableHeader>
          <tr>
            <CheckboxCell as="th">
              <Checkbox
                type="checkbox"
                checked={selectedCustomers.size === customers.length && customers.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </CheckboxCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Clerk ID</TableHeaderCell>
            <TableHeaderCell>Joined</TableHeaderCell>
            <TableHeaderCell>Last Updated</TableHeaderCell>
            <ActionsCell as="th">Actions</ActionsCell>
          </tr>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <tr>
              <TableCell colSpan={7}>
                <EmptyMessage>No customers found</EmptyMessage>
              </TableCell>
            </tr>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id} selected={selectedCustomers.has(customer.id)}>
                <CheckboxCell>
                  <Checkbox
                    type="checkbox"
                    checked={selectedCustomers.has(customer.id)}
                    onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                  />
                </CheckboxCell>
                <TableCell>{customer.name || "—"}</TableCell>
                <TableCell>{customer.email || "—"}</TableCell>
                <TableCell>
                  <code
                    style={{
                      fontSize: "12px",
                      background: "#f8f9fa",
                      padding: "2px 4px",
                      borderRadius: "3px",
                    }}
                  >
                    {customer.clerk_id}
                  </code>
                </TableCell>
                <TableCell>{formatDate(customer.created_at)}</TableCell>
                <TableCell>{formatDate(customer.updated_at)}</TableCell>
                <ActionsCell>
                  <ActionButton variant="delete" onClick={() => onDeleteCustomer(customer.id)}>
                    Delete
                  </ActionButton>
                </ActionsCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationContainer>
        <PaginationInfo>
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{" "}
          customers
        </PaginationInfo>

        <PaginationControls>
          <PageSelect
            value={pagination.limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </PageSelect>

          <PaginationButton
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </PaginationButton>

          <PageSelect
            value={pagination.page}
            onChange={(e) => onPageChange(parseInt(e.target.value))}
          >
            {Array.from({ length: pagination.pages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Page {i + 1}
              </option>
            ))}
          </PageSelect>

          <PaginationButton
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </PaginationButton>
        </PaginationControls>
      </PaginationContainer>
    </TableContainer>
  );
};

export default CustomerTable;
