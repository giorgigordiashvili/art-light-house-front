import AdminDashboardLayout from "@/components/Admin/Layout/AdminDashboardLayout";
import AdminHero from "@/components/Admin/Hero/AdminHero";

export default function AdminDashboardPage() {
  return (
    <AdminDashboardLayout>
      <AdminHero username="Admin" productCount={0} orderCount={0} customerCount={0} />
    </AdminDashboardLayout>
  );
}
