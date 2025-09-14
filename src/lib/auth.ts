"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";

// Get authenticated user data using next-auth
export async function getAuthenticatedUserData() {
  const session = await getServerSession(authOptions);

  // If no session, the user is not logged in
  if (!session?.user) {
    return { authenticated: false };
  }

  // User is authenticated
  return {
    authenticated: true,
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}
