import { useState, useEffect } from "react";
import { addressList } from "@/api/generated/api";
import { Address } from "@/api/generated/interfaces";

interface UseAddressesResult {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAddresses = (): UseAddressesResult => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedAddresses = await addressList();
      setAddresses(fetchedAddresses);

      console.log("✅ Addresses fetched successfully:", fetchedAddresses);
    } catch (err: any) {
      console.error("❌ Failed to fetch addresses:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
    addresses,
    loading,
    error,
    refetch: fetchAddresses,
  };
};
