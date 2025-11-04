import { useState, useEffect, useCallback } from "react";
import { apiEcommerceClientAddressesList } from "@/api/generated/api";
import { ClientAddress } from "@/api/generated/interfaces";
import { useAuth } from "@/contexts/AuthContext";

interface UseAddressesResult {
  addresses: ClientAddress[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAddresses = (): UseAddressesResult => {
  const [addresses, setAddresses] = useState<ClientAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated: authContextIsAuthenticated } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(authContextIsAuthenticated);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated from AuthContext
      if (!authContextIsAuthenticated) {
        setIsAuthenticated(false);
        setAddresses([]);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      const response = await apiEcommerceClientAddressesList();
      setAddresses(response.results || []);
    } catch (err: any) {
      // Check if it's a 401 authentication error
      if (err?.response?.status === 401) {
        setIsAuthenticated(false);
        setError(null); // Don't show error for authentication issues
      } else {
        setError(err?.response?.data?.message || err?.message || "Failed to fetch addresses");
      }
    } finally {
      setLoading(false);
    }
  }, [authContextIsAuthenticated]);

  useEffect(() => {
    // Update local isAuthenticated state when AuthContext changes
    setIsAuthenticated(authContextIsAuthenticated);
  }, [authContextIsAuthenticated]);

  useEffect(() => {
    fetchAddresses();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_access_token") {
        fetchAddresses();
      }
    };

    // Listen for custom auth events (when user logs in/out in same tab)
    const handleAuthChange = () => {
      fetchAddresses();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [fetchAddresses]); // Re-run when fetchAddresses changes (which happens when auth state changes)

  return {
    addresses,
    loading,
    error,
    refetch: fetchAddresses,
    isAuthenticated,
  };
};
