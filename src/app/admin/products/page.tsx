import AdminDashboardLayout from "@/components/Admin/Layout/AdminDashboardLayout";
import ProductManagement from "@/components/Admin/Products/ProductManagement";

export default function AdminProductsPage() {
  return (
    <AdminDashboardLayout>
      <ProductManagement />
    </AdminDashboardLayout>
  );
}
