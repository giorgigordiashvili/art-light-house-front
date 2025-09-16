"use client";
import React from "react";
import { ApiAuthManager } from "@/lib/apiAuthManager";

export default function AuthDebugButton() {
  const checkAuth = () => {
    console.log("🔍 Authentication Debug Info:");
    console.log(ApiAuthManager.debugAuth());

    // Also check localStorage directly
    console.log("📦 Direct localStorage check:");
    console.log({
      access_token: localStorage.getItem("access_token"),
      token_type: localStorage.getItem("token_type"),
      api_user: localStorage.getItem("api_user"),
    });
  };

  const clearAuth = () => {
    ApiAuthManager.logout();
    console.log("🧹 Authentication data cleared");
  };

  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}>
      <button onClick={checkAuth} style={{ marginRight: 10, padding: "5px 10px" }}>
        Check Auth
      </button>
      <button onClick={clearAuth} style={{ padding: "5px 10px" }}>
        Clear Auth
      </button>
    </div>
  );
}
