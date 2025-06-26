"use client";
import React, { useState, useEffect } from "react";
import AdminHero from "../Hero/AdminHero";

interface DashboardStats {
  productCount: number;
  orderCount: number;
  customerCount: number;
  languageCount: number;
  attributeTypeCount: number;
  categoryCount: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    productCount: 0,
    orderCount: 0,
    customerCount: 0,
    languageCount: 0,
    attributeTypeCount: 0,
    categoryCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, languages, attributeTypes, categories] = await Promise.all([
          fetch("/api/admin/products?page=1&limit=1"),
          fetch("/api/admin/languages"),
          fetch("/api/admin/attribute-types"),
          fetch("/api/admin/categories"),
        ]);

        const [productsData, languagesData, attributeTypesData, categoriesData] = await Promise.all(
          [products.json(), languages.json(), attributeTypes.json(), categories.json()]
        );

        setStats({
          productCount: productsData.pagination?.total || 0,
          orderCount: 0, // TODO: Implement when orders API is ready
          customerCount: 0, // TODO: Implement when customers API is ready
          languageCount: languagesData.length || 0,
          attributeTypeCount: attributeTypesData.length || 0,
          categoryCount: categoriesData.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#7d879c" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <AdminHero
      username="Admin"
      productCount={stats.productCount}
      orderCount={stats.orderCount}
      customerCount={stats.customerCount}
      languageCount={stats.languageCount}
      attributeTypeCount={stats.attributeTypeCount}
    />
  );
};

export default AdminDashboard;
