import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type DatabaseUser = {
  id: string;
  clerkId: string;
  email?: string | null;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function useDatabaseUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [dbUser, setDbUser] = useState<DatabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDatabaseUser = async () => {
      if (!isLoaded || !isSignedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/user");

        if (!response.ok) {
          throw new Error(`Error fetching database user: ${response.status}`);
        }

        const data = await response.json();
        setDbUser(data.user);
      } catch (err) {
        console.error("Error fetching database user:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabaseUser();
  }, [isLoaded, isSignedIn, user?.id]);

  return {
    dbUser,
    isLoading,
    error,
    clerkUser: user,
    isAuthenticated: isSignedIn && !!dbUser,
  };
}
