import AdminDashboardLayout from "@/components/Admin/Layout/AdminDashboardLayout";
import CategoryManagement from "@/components/Admin/Categories/CategoryManagement";

export default function AdminCategoriesPage() {
  return (
    <AdminDashboardLayout>
      <CategoryManagement />
    </AdminDashboardLayout>
  );
}
