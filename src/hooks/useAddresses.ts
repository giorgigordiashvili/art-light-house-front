import { useState, useEffect } from "react";
import { apiEcommerceClientAddressesList } from "@/api/generated/api";
import { ClientAddress } from "@/api/generated/interfaces";

interface UseAddressesResult {
  addresses: ClientAddress[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAddresses = (): UseAddressesResult => {
  const [addresses, setAddresses] = useState<ClientAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiEcommerceClientAddressesList();
      setAddresses(response.results || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAddresses();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  return {
    addresses,
    loading,
    error,
    refetch: fetchAddresses,
  };
};
