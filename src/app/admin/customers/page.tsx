"use client";

import React from "react";
import AdminDashboardLayout from "@/components/Admin/Layout/AdminDashboardLayout";
import CustomerManagement from "@/components/Admin/Customers/CustomerManagement";

export default function CustomersPage() {
  return (
    <AdminDashboardLayout>
      <CustomerManagement />
    </AdminDashboardLayout>
  );
}
